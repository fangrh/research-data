import {
  type Scene,
  type SceneElement,
  type Transform,
  isLocked,
  selectedRoots,
  ancestors,
} from "../src/model";
import { transform2d, sceneBounds } from "../src/export2d";
import { styleAttrs, gradientDefs, clipStyle } from "../src/svgStyle";
type Callbacks = {
  select: (id: string | undefined, additive: boolean) => void;
  activateSelection?: () => void;
  editViewport?: (id: string) => void;
  commit: (
    updates: Array<{ id: string; changes: { transform: Transform } }>,
    version: number,
  ) => void;
  error: (message: string) => void;
};
const NS = "http://www.w3.org/2000/svg";
const node = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attributes: Record<string, unknown> = {},
) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attributes)) n.setAttribute(k, String(v));
  return n;
};
type Gesture = {
  kind: "translate" | "rotate" | "scale" | "pan";
  start: DOMPoint;
  version: number;
  ids: string[];
  initial: Map<string, Transform>;
  parents: Map<string, DOMMatrix>;
  locals: Map<string, DOMMatrix>;
  preview: Map<string, Transform>;
  pointer: number;
  moved: boolean;
  view: { x: number; y: number; zoom: number };
  viewport: { left: number; top: number };
  centers: Map<string, DOMPoint>;
  bounds: Map<string, DOMRect>;
  angles: Map<string, number>;
  turns: Map<string, number>;
  corner?: string;
  toggleOnClick?: string;
};
export class Renderer2D {
  private svg: SVGSVGElement;
  private content: SVGGElement;
  private selectionLayer = node("g", { class: "selection-layer" });
  private selectionGroups = new Map<string, SVGGElement>();
  private scene?: Scene;
  private selected: string[] = [];
  private version = 0;
  private disabled = false;
  private tool: "translate" | "rotate" | "scale" = "translate";
  private assets: Record<string, string> = {};
  private viewportImages: Record<string, string> = {};
  private groups = new Map<string, SVGGElement>();
  private view = { x: 0, y: 0, zoom: 1 };
  private gesture?: Gesture;
  private observer: ResizeObserver;
  private drawFrame = 0;
  private fitOnResize = false;
  private sceneDirty = true;
  private selectionDirty = true;
  private decorations: SVGElement[] = [];
  private bounds = new Map<string, DOMRect>();
  private previewed = new Set<string>();
  private committedPreview?: { version: number; transforms: Map<string, Transform> };
  constructor(
    private container: HTMLElement,
    private callbacks: Callbacks,
  ) {
    this.svg = node("svg", { "data-testid": "svg-canvas", class: "drawing" });
    this.content = node("g");
    this.svg.append(this.content);
    container.replaceChildren(this.svg);
    this.svg.addEventListener("pointerdown", this.down);
    this.svg.addEventListener("wheel", this.wheel, { passive: false });
    this.svg.addEventListener("dblclick", event => {
      const group = (event.target as Element).closest("[data-element-id]");
      const id = group?.getAttribute("data-element-id");
      if (!this.disabled && id && this.scene?.elements[id]?.type === "viewport3d") {
        event.preventDefault(); this.callbacks.editViewport?.(id);
      }
    });
    window.addEventListener("pointermove", this.move);
    window.addEventListener("pointerup", this.up);
    window.addEventListener("pointercancel", this.cancel);
    window.addEventListener("keydown", this.keydown, true);
    this.observer = new ResizeObserver(() => {
      // Keep the pointer coordinate system fixed until the gesture completes.
      if (this.gesture) return;
      if (this.fitOnResize) this.fit();
      else this.scheduleDraw();
    });
    this.observer.observe(container);
  }
  setAssets(assets: Record<string, string>) {
    this.assets = assets;
  }
  setViewportImages(images: Record<string, string>) {
    this.viewportImages = images;
    for (const [id, group] of this.groups) {
      const image = group.querySelector("[data-viewport-image]");
      if (image) {
        image.setAttribute("href", images[id] ?? "");
        group.querySelector("[data-viewport-loading]")?.setAttribute("visibility", images[id] ? "hidden" : "visible");
      }
    }
  }
  placementPoint(clientX: number, clientY: number): [number, number, number] {
    const point = new DOMPoint(clientX, clientY).matrixTransform(
      this.content.getScreenCTM()!.inverse(),
    );
    return [point.x, point.y, 0];
  }
  setState(
    scene: Scene,
    selected: string[],
    version: number,
    disabled: boolean,
  ) {
    if (this.committedPreview &&
        (version !== this.committedPreview.version || (this.disabled && !disabled)))
      this.committedPreview = undefined;
    if (this.gesture && (version !== this.gesture.version || disabled))
      this.gesture = undefined;
    if (scene !== this.scene) this.sceneDirty = true;
    if (disabled !== this.disabled || selected.join("\0") !== this.selected.join("\0"))
      this.selectionDirty = true;
    this.scene = scene;
    this.selected = selected;
    this.version = version;
    this.disabled = disabled;
    this.scheduleDraw();
  }
  setTool(tool: "translate" | "rotate" | "scale") {
    this.selectionDirty ||= tool !== this.tool;
    this.tool = tool;
    this.scheduleDraw();
  }
  private matrix(id: string, includeSelf: boolean, preview?: Map<string, Transform>) {
    let m = new DOMMatrix();
    const all = ancestors(this.scene!, id);
    if (includeSelf) all.push(this.scene!.elements[id]);
    for (const e of all) {
      const t = preview?.get(e.id) ?? e.transform;
      m = m
        .translate(t.position[0], t.position[1])
        .rotate((t.rotation[2] * 180) / Math.PI)
        .scale(t.scale[0], t.scale[1]);
    }
    return m;
  }
  private screenPoint(event: PointerEvent | WheelEvent) {
    const r = this.svg.getBoundingClientRect();
    return new DOMPoint(
      (event.clientX - r.left - this.view.x) / this.view.zoom,
      (event.clientY - r.top - this.view.y) / this.view.zoom,
    );
  }
  private scheduleDraw() {
    if (this.drawFrame) return;
    this.drawFrame = requestAnimationFrame(() => {
      this.drawFrame = 0;
      this.draw();
    });
  }
  private draw() {
    if (!this.scene) return;
    const viewTransform = `translate(${this.view.x} ${this.view.y}) scale(${this.view.zoom})`;
    if (this.content.getAttribute("transform") !== viewTransform) {
      this.content.setAttribute("transform", viewTransform);
      this.selectionDirty = true;
    }
    if (this.sceneDirty) this.buildScene();
    const transforms = this.gesture?.preview ?? this.committedPreview?.transforms;
    const nextPreviewed = new Set(transforms?.keys() ?? []);
    for (const id of new Set([...this.previewed, ...nextPreviewed])) {
      const group = this.groups.get(id), element = this.scene.elements[id];
      if (group && element) {
        const transform = transforms?.get(id) ?? element.transform;
        const value = transform2d({ ...element, transform });
        if (group.getAttribute("transform") !== value) group.setAttribute("transform", value);
      }
    }
    this.previewed = nextPreviewed;
    if (this.gesture?.kind === "scale") this.selectionDirty = true;
    if (this.selectionDirty) this.drawSelection();
    for (const [id, group] of this.selectionGroups) {
      const value = this.matrix(id, true, transforms).toString();
      if (group.getAttribute("transform") !== value) group.setAttribute("transform", value);
    }
  }
  private buildScene() {
    if (!this.scene) return;
    this.groups.clear();
    this.bounds.clear();
    this.decorations = [];
    this.previewed.clear();
    this.content.replaceChildren();
    this.svg.querySelector("defs")?.remove();
    const defs = node("defs"); this.svg.prepend(defs);
    const elements = Object.values(this.scene.elements);
    const children = new Map<string | undefined, SceneElement[]>();
    for (const element of elements) {
      const siblings = children.get(element.parent) ?? [];
      siblings.push(element);
      children.set(element.parent, siblings);
    }
    const add = (e: SceneElement, parent: SVGGElement) => {
      if (!e.visible) return;
      const transform = e.transform;
      const g = node("g", {
        "data-element-id": e.id,
        transform: transform2d({ ...e, transform }),
      });
      this.groups.set(e.id, g);
      parent.append(g);
      const p = e.properties;
      let shape: SVGElement | undefined;
      const style = styleAttrs(p);
      if (e.type === "group" && p.opacity !== undefined) g.setAttribute("opacity", String(p.opacity));
      if (p.fillGradient) style.fill = `url(#${e.id}-fillGradient)`;
      if (p.strokeGradient) style.stroke = `url(#${e.id}-strokeGradient)`;
      const clip = clipStyle(e.id, p); if (clip.attr) g.setAttribute("clip-path", clip.attr.match(/url\(#([^)]*)\)/)![0]);
      if (clip.defs) { const holder = document.createElementNS(NS, "g"); holder.innerHTML = clip.defs; while (holder.firstChild) defs.append(holder.firstChild); }
      const gradients = gradientDefs(e.id, p); if (gradients) { const holder = document.createElementNS(NS, "g"); holder.innerHTML = gradients; while (holder.firstChild) defs.append(holder.firstChild); }
      switch (e.type) {
        case "rect":
          shape = node("rect", { width: p.width, height: p.height, ...style });
          break;
        case "ellipse":
          shape = node("ellipse", {
            cx: p.width! / 2,
            cy: p.height! / 2,
            rx: p.width! / 2,
            ry: p.height! / 2,
            ...style,
          });
          break;
        case "line":
        case "polyline":
          shape = node("polyline", {
            points: p.points!.map((x) => x.join(",")).join(" "),
            ...style,
          });
          break;
        case "path":
          shape = node("path", { d: p.d, ...style });
          break;
        case "text":
          shape = node("text", {
            "font-size": p.fontSize,
            "font-family": p.fontFamily ?? "sans-serif",
            "font-weight": p.fontWeight ?? 400,
            "text-anchor": p.textAnchor ?? "start",
            "xml:space": "preserve",
            ...style,
          });
          shape.textContent = String(p.text);
          break;
        case "image":
          if (this.assets[String(p.src)])
            shape = node("image", {
              href: this.assets[String(p.src)],
              width: p.width,
              height: p.height,
              opacity: p.opacity ?? 1,
            });
          else {
            shape = node("rect", {
              width: p.width,
              height: p.height,
              fill: "#6e3540",
              stroke: "#ff8296",
              "stroke-dasharray": "5 4",
            });
            const title = node("title");
            title.textContent = `Missing image: ${p.src}`;
            shape.append(title);
          }
          break;
        case "viewport3d": {
          const panel = node("g");
          panel.append(node("rect", {width: p.width, height: p.height, fill: p.background ?? "#ffffff"}));
          panel.append(node("image", {"data-viewport-image": "", href: this.viewportImages[e.id] ?? "", width: p.width, height: p.height, opacity: p.opacity ?? 1}));
          const text = node("text", {"data-viewport-loading": "", x: 8, y: 20, fill: "#334155", "font-size": 12, visibility: this.viewportImages[e.id] ? "hidden" : "visible"});
          text.textContent = "3D view · double-click to edit"; panel.append(text);
          shape = panel; break;
        }
        case "group":
          break;
      }
      if (shape) {
        shape.setAttribute("pointer-events", "all");
        g.append(shape);
      }
      for (const child of children.get(e.id) ?? []) add(child, g);
    };
    for (const e of children.get(undefined) ?? []) add(e, this.content);
    this.content.append(this.selectionLayer);
    this.sceneDirty = false;
    this.selectionDirty = true;
  }
  private localBounds(id: string) {
    let bounds = this.bounds.get(id);
    if (!bounds) {
      const group = this.groups.get(id);
      if (!group) return undefined;
      try { bounds = group.getBBox(); } catch { return undefined; }
      this.bounds.set(id, bounds);
    }
    return bounds;
  }
  private decorate(group: SVGGElement, decoration: SVGElement) {
    group.append(decoration);
    this.decorations.push(decoration);
  }
  private drawSelection() {
    if (!this.scene) return;
    this.decorations.forEach((decoration) => decoration.remove());
    this.decorations = [];
    this.selectionLayer.replaceChildren();
    this.selectionGroups.clear();
    for (const id of this.selected) {
      if (!this.groups.has(id)) continue;
      const b = this.localBounds(id);
      if (!b) continue;
      if (!b.width && !b.height) continue;
      const g = node("g", { "data-selection-id": id, transform: this.matrix(id, true, this.gesture?.preview ?? this.committedPreview?.transforms).toString() });
      this.selectionLayer.append(g);
      this.selectionGroups.set(id, g);
      this.decorate(g,
        node("rect", {
          x: b.x - 3,
          y: b.y - 3,
          width: b.width + 6,
          height: b.height + 6,
          fill: "none",
          stroke: "#facc15",
          "stroke-width": 1.5,
          "vector-effect": "non-scaling-stroke",
          "pointer-events": "none",
          class: "selection-outline",
        }),
      );
      if (
        this.selected.length === 1 &&
        !this.disabled &&
        !isLocked(this.scene, id)
      ) {
        const matrix = g.getScreenCTM();
        const sx = Math.max(0.001, Math.hypot(matrix?.a ?? this.view.zoom, matrix?.b ?? 0));
        const sy = Math.max(0.001, Math.hypot(matrix?.c ?? 0, matrix?.d ?? this.view.zoom));
        for (const [corner, fx, fy] of [
          ["nw", 0, 0], ["n", 0.5, 0], ["ne", 1, 0], ["e", 1, 0.5],
          ["se", 1, 1], ["s", 0.5, 1], ["sw", 0, 1], ["w", 0, 0.5],
        ] as const)
          this.decorate(g,
            node("rect", {
              x: b.x + b.width * fx - 4 / sx,
              y: b.y + b.height * fy - 4 / sy,
              width: 8 / sx,
              height: 8 / sy,
              fill: "var(--ti-panel)",
              stroke: "#facc15",
              "stroke-width": 1,
              "vector-effect": "non-scaling-stroke",
              "data-handle": "scale",
              "data-corner": corner,
              "data-testid": corner === "se" ? "resize-handle" : `resize-handle-${corner}`,
              style: `cursor:${corner}-resize`,
            }),
          );
        this.decorate(g, node("line", {
          x1: b.x + b.width / 2, y1: b.y,
          x2: b.x + b.width / 2, y2: b.y - 28 / sy,
          stroke: "#facc15", "stroke-width": 1,
          "vector-effect": "non-scaling-stroke", "pointer-events": "none",
        }));
        this.decorate(g,
            node("circle", {
              cx: b.x + b.width / 2,
              cy: b.y - 28 / sy,
              r: 7 / Math.max(sx, sy),
              fill: "#facc15",
              "data-handle": "rotate",
              "data-testid": "rotate-handle",
              style: "cursor:grab",
            }),
          );
      }
    }
    this.selectionDirty = false;
  }
  private anchoredTransform(initial: Transform, anchor: DOMPoint, next: Transform) {
    const offset = (transform: Transform) => new DOMMatrix()
      .rotate(transform.rotation[2] * 180 / Math.PI)
      .scale(transform.scale[0], transform.scale[1])
      .transformPoint(anchor);
    const before = offset(initial), after = offset(next);
    next.position[0] = initial.position[0] + before.x - after.x;
    next.position[1] = initial.position[1] + before.y - after.y;
    return next;
  }
  /** Inspector and quick controls use the same visual-center pivot as the handle. */
  rotateSelected(degrees: number, absolute = false) {
    if (!this.scene || this.disabled || this.gesture || !Number.isFinite(degrees)) return;
    if (this.sceneDirty) this.draw();
    const updates = selectedRoots(this.scene, this.selected)
      .filter((id) => !isLocked(this.scene!, id))
      .flatMap((id) => {
        const bounds = this.localBounds(id);
        if (!bounds) return [];
        const initial = this.scene!.elements[id].transform;
        const next = structuredClone(initial);
        next.rotation[2] = (absolute ? 0 : initial.rotation[2]) + degrees * Math.PI / 180;
        return [{ id, changes: { transform: this.anchoredTransform(initial,
          new DOMPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2), next) } }];
      });
    if (updates.length) {
      this.committedPreview = { version: this.version, transforms: new Map(updates.map((u) => [u.id, u.changes.transform])) };
      this.callbacks.commit(updates, this.version);
      this.scheduleDraw();
    }
  }
  private down = (event: PointerEvent) => {
    if (!this.scene || event.button > 1) return;
    const target = event.target as Element;
    const id = target
      .closest("[data-element-id],[data-selection-id]");
    const elementId = id?.getAttribute("data-element-id") ?? id?.getAttribute("data-selection-id");
    const handle = target.getAttribute("data-handle");
    // A resize may have queued a fit that has not painted yet. Begin from
    // the transform the user actually sees, then keep it fixed while dragging.
    const displayed = this.content.transform.baseVal.consolidate()?.matrix;
    if (displayed)
      this.view = { x: displayed.e, y: displayed.f, zoom: displayed.a };
    const start = this.screenPoint(event);
    const viewport = this.svg.getBoundingClientRect();
    if (event.button === 1 || !elementId) {
      if (event.button === 0 && !event.shiftKey)
        this.callbacks.select(undefined, false);
      this.gesture = {
        kind: "pan",
        start: new DOMPoint(event.clientX, event.clientY),
        version: this.version,
        ids: [],
        initial: new Map(),
        parents: new Map(),
        locals: new Map(),
        preview: new Map(),
        pointer: event.pointerId,
        moved: false,
        view: { ...this.view },
        viewport,
        centers: new Map(), bounds: new Map(), angles: new Map(), turns: new Map(),
      };
      this.svg.setPointerCapture(event.pointerId);
      return;
    }
    const hitId = elementId;
    event.preventDefault();
    const selectedHit = () => this.selected.some((selected) => selected === hitId || ancestors(this.scene!, hitId).some((parent) => parent.id === selected));
    const alreadySelected = selectedHit();
    // Clicking a visible child drills into it even when its group is selected.
    // Group dragging remains available through the selection outline/handles,
    // whose hit target is the group itself.
    if (!alreadySelected || this.scene.elements[hitId]?.parent)
      this.callbacks.select(hitId, event.shiftKey);
    else this.callbacks.activateSelection?.();
    if (
      this.disabled ||
      isLocked(this.scene, hitId) ||
      !selectedHit()
    )
      return;
    const ids = selectedRoots(this.scene, this.selected).filter(
      (id) => !isLocked(this.scene!, id),
    );
    const initial = new Map(
      ids.map((id) => [
        id,
        structuredClone(this.scene!.elements[id].transform),
      ]),
    );
    const bounds = new Map(ids.flatMap((id) => {
      const b = this.localBounds(id);
      return b ? [[id, b] as const] : [];
    }));
    const centers = new Map([...bounds].map(([id, b]) => [id, new DOMPoint(b.x + b.width / 2, b.y + b.height / 2)]));
    const parents = new Map(ids.map((id) => [id, this.matrix(id, false).inverse()]));
    const angles = new Map(ids.map((id) => {
      const center = centers.get(id) ?? new DOMPoint();
      const t = initial.get(id)!;
      const pivot = new DOMMatrix().translate(t.position[0], t.position[1])
        .rotate(t.rotation[2] * 180 / Math.PI).scale(t.scale[0], t.scale[1]).transformPoint(center);
      const a = start.matrixTransform(parents.get(id)!);
      return [id, Math.atan2(a.y - pivot.y, a.x - pivot.x)];
    }));
    this.gesture = {
      kind:
        handle === "rotate"
          ? "rotate"
          : handle === "scale"
            ? "scale"
            : this.tool,
      start,
      version: this.version,
      ids,
      initial,
      parents,
      locals: new Map(ids.map((id) => [id, this.matrix(id, true)])),
      preview: new Map(),
      pointer: event.pointerId,
      moved: false,
      view: { ...this.view },
      viewport, centers, bounds, angles, turns: new Map(ids.map((id) => [id, 0])),
      corner: target.getAttribute("data-corner") ?? "se",
      toggleOnClick: alreadySelected && event.shiftKey && !handle ? hitId : undefined,
    };
    this.svg.setPointerCapture(event.pointerId);
  };
  private move = (event: PointerEvent) => {
    const g = this.gesture;
    if (!g || g.pointer !== event.pointerId) return;
    if (g.kind === "pan") {
      const dx = event.clientX - g.start.x,
        dy = event.clientY - g.start.y;
      g.moved ||= Math.abs(dx) + Math.abs(dy) > 2;
      if (g.moved) this.fitOnResize = false;
      this.view.x = g.view.x + dx;
      this.view.y = g.view.y + dy;
      this.scheduleDraw();
      return;
    }
    if (this.disabled) return;
    const now = new DOMPoint(
      (event.clientX - g.viewport.left - g.view.x) / g.view.zoom,
      (event.clientY - g.viewport.top - g.view.y) / g.view.zoom,
    );
    if (
      Math.abs(now.x - g.start.x) + Math.abs(now.y - g.start.y) >
      1 / this.view.zoom
    )
      g.moved = true;
    if (g.moved) this.fitOnResize = false;
    for (const id of g.ids) {
      const initial = g.initial.get(id)!;
      const transform = structuredClone(initial);
      const inv = g.parents.get(id)!;
      const a = g.start.matrixTransform(inv),
        b = now.matrixTransform(inv);
      if (g.kind === "translate") {
        let dx = b.x - a.x, dy = b.y - a.y;
        if (event.shiftKey) {
          if (Math.abs(dx) >= Math.abs(dy)) dy = 0;
          else dx = 0;
        }
        transform.position[0] += dx;
        transform.position[1] += dy;
      } else if (g.kind === "rotate") {
        const center = g.centers.get(id) ?? new DOMPoint();
        const pivot = new DOMMatrix().translate(initial.position[0], initial.position[1])
          .rotate(initial.rotation[2] * 180 / Math.PI).scale(initial.scale[0], initial.scale[1]).transformPoint(center);
        const angle = Math.atan2(b.y - pivot.y, b.x - pivot.x);
        const step = angle - g.angles.get(id)!;
        const turn = g.turns.get(id)! + Math.atan2(Math.sin(step), Math.cos(step));
        g.angles.set(id, angle);
        g.turns.set(id, turn);
        transform.rotation[2] += turn;
        if (event.shiftKey) transform.rotation[2] = Math.round(transform.rotation[2] / (Math.PI / 12)) * Math.PI / 12;
        this.anchoredTransform(initial, center, transform);
      } else {
        const localInv = g.locals.get(id)!.inverse(),
          aLocal = g.start.matrixTransform(localInv),
          bLocal = now.matrixTransform(localInv);
        const bounds = g.bounds.get(id);
        if (!bounds) continue;
        const corner = g.corner ?? "se";
        const anchor = new DOMPoint(
          bounds.x + bounds.width * (corner.includes("w") ? 1 : corner.includes("e") ? 0 : 0.5),
          bounds.y + bounds.height * (corner.includes("n") ? 1 : corner.includes("s") ? 0 : 0.5),
        );
        const ax = aLocal.x - anchor.x, ay = aLocal.y - anchor.y;
        let rx = Math.abs(ax) > 1e-8 ? (bLocal.x - anchor.x) / ax : 1;
        let ry = Math.abs(ay) > 1e-8 ? (bLocal.y - anchor.y) / ay : 1;
        const horizontal = corner.includes("e") || corner.includes("w");
        const vertical = corner.includes("n") || corner.includes("s");
        if (horizontal && vertical && (this.scene?.elements[id].type === "image" || event.shiftKey)) {
          const factor = (ax * (bLocal.x - anchor.x) + ay * (bLocal.y - anchor.y)) / (ax * ax + ay * ay || 1);
          rx = ry = factor;
        }
        if (horizontal) transform.scale[0] = initial.scale[0] * Math.max(0.01 / Math.abs(initial.scale[0]), rx);
        if (vertical) transform.scale[1] = initial.scale[1] * Math.max(0.01 / Math.abs(initial.scale[1]), ry);
        this.anchoredTransform(initial, anchor, transform);
      }
      g.preview.set(id, transform);
    }
    this.scheduleDraw();
  };
  private up = (event: PointerEvent) => {
    const g = this.gesture;
    if (!g || g.pointer !== event.pointerId) return;
    this.move(event);
    this.gesture = undefined;
    if (this.svg.hasPointerCapture(event.pointerId))
      this.svg.releasePointerCapture(event.pointerId);
    if (!g.moved && g.toggleOnClick) this.callbacks.select(g.toggleOnClick, true);
    if (g.kind !== "pan" && g.moved && g.preview.size && !this.disabled) {
      this.committedPreview = { version: g.version, transforms: g.preview };
      this.callbacks.commit(
        [...g.preview].map(([id, transform]) => ({
          id,
          changes: { transform },
        })),
        g.version,
      );
    }
    this.scheduleDraw();
  };
  private cancel = () => {
    if (this.gesture?.kind === "pan") this.view = { ...this.gesture.view };
    const pointer = this.gesture?.pointer;
    this.gesture = undefined;
    this.selectionDirty = true;
    if (pointer !== undefined && this.svg.hasPointerCapture(pointer)) this.svg.releasePointerCapture(pointer);
    this.scheduleDraw();
  };
  private keydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.gesture) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.cancel();
    }
  };
  private wheel = (event: WheelEvent) => {
    event.preventDefault();
    if (this.gesture) return;
    this.fitOnResize = false;
    const before = this.screenPoint(event);
    const r = this.svg.getBoundingClientRect();
    this.view.zoom = Math.max(
      0.02,
      Math.min(100, this.view.zoom * Math.exp(-event.deltaY * 0.001)),
    );
    this.view.x = event.clientX - r.left - before.x * this.view.zoom;
    this.view.y = event.clientY - r.top - before.y * this.view.zoom;
    this.scheduleDraw();
  };
  fit() {
    if (!this.scene) return;
    this.fitOnResize = true;
    const [x, y, w, h] = sceneBounds(this.scene);
    const cw = this.container.clientWidth,
      ch = this.container.clientHeight;
    this.view.zoom = Math.max(
      0.02,
      Math.min(10, Math.min(cw / w, ch / h) * 0.9),
    );
    this.view.x = (cw - w * this.view.zoom) / 2 - x * this.view.zoom;
    this.view.y = (ch - h * this.view.zoom) / 2 - y * this.view.zoom;
    this.scheduleDraw();
  }
  dispose() {
    if (this.drawFrame) cancelAnimationFrame(this.drawFrame);
    this.drawFrame = 0;
    this.observer.disconnect();
    this.svg.removeEventListener("pointerdown", this.down);
    this.svg.removeEventListener("wheel", this.wheel);
    window.removeEventListener("pointermove", this.move);
    window.removeEventListener("pointerup", this.up);
    window.removeEventListener("pointercancel", this.cancel);
    window.removeEventListener("keydown", this.keydown, true);
    this.svg.remove();
  }
}
