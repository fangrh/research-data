import { parseTree, type Node as JsonNode } from "jsonc-parser";
import type { SceneChangeEntry, WorkOrder } from "./workOrders";
import { validateStyle } from "./svgStyle";
export type Mode = "2d" | "3d";
export type ElementType =
  | "rect"
  | "ellipse"
  | "line"
  | "polyline"
  | "path"
  | "text"
  | "image"
  | "viewport3d"
  | "group"
  | "box"
  | "sphere"
  | "cylinder"
  | "plane";
export interface Transform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}
export interface ViewportCamera {
  position: [number, number, number];
  target: [number, number, number];
}
export interface SceneElement {
  id: string;
  name: string;
  type: ElementType;
  parent?: string;
  visible: boolean;
  locked: boolean;
  transform: Transform;
  properties: {
    [key: string]: unknown;
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    points?: number[][];
    d?: string;
    text?: string;
    fontSize?: number;
    textAnchor?: "start" | "middle" | "end";
    fontWeight?: number;
    fontFamily?: string;
    src?: string;
    scene?: Scene;
    camera?: ViewportCamera;
    background?: string;
    strokeDasharray?: number[]; strokeDashoffset?: number; strokeLinecap?: "butt"|"round"|"square"; strokeLinejoin?: "miter"|"round"|"bevel"; fillOpacity?: number; strokeOpacity?: number; fillRule?: "nonzero"|"evenodd"; fontStyle?: "normal"|"italic"|"oblique"; clipRects?: unknown[]; fillGradient?: unknown; strokeGradient?: unknown;
  };
}
export interface Scene {
  schema: "three-interact.scene";
  version: 1;
  id: string;
  mode: Mode;
  units: string;
  coordinates: string;
  elements: Record<string, SceneElement>;
}
export type Operation =
  | { kind: "insert"; element: SceneElement }
  | { kind: "insertMany"; elements: SceneElement[] }
  | {
      kind: "update";
      updates: Array<{
        id: string;
        changes: Partial<Omit<SceneElement, "id" | "type" | "parent">> & {
          parent?: string | null;
        };
      }>;
    }
  | { kind: "delete"; ids: string[] }
  | { kind: "duplicate"; ids: string[] };
export type ClientMessage =
  | { type: "ready" }
  | {
      type: "selection";
      ids: string[];
      instruction: string;
      instructionTooLong?: boolean;
    }
  | { type: "edit"; version: number; operation: Operation }
  | {
      type: "copy";
      version: number;
      ids: string[];
      instruction: string;
      compact: boolean;
    }
  | { type: "reveal"; id: string }
  | { type: "insertImage"; version: number; viewportId?: string }
  | { type: "saveScene"; version: number }
  | { type: "elementCopy"; version: number; ids: string[] }
  | { type: "elementPaste"; version: number }
  | {
      type: "workOrderAdd";
      version: number;
      ids: string[];
      requirement: string;
      historySequence?: number;
    }
  | { type: "workOrderRefresh" }
  | { type: "historyRefresh" }
  | { type: "historyCopy" }
  | { type: "componentsRefresh" }
  | { type: "componentGuideCopy" }
  | { type: "componentSave"; version: number; ids: string[] }
  | { type: "workOrderCopy"; id?: string }
  | { type: "workOrderHighlight"; id: string }
  | { type: "export"; version: number; format: "svg" | "glb"; data: string; viewportImages?: Record<string, string> };
export type HostMessage =
  | {
      type: "components";
      entries: import("./components").ComponentEntry[];
      warnings: string[];
      directory: string;
    }
  | {
      type: "state";
      scene: Scene;
      version: number;
      dirty: boolean;
      autoSave?: boolean;
      assets: Record<string, string>;
      warnings: string[];
    }
  | { type: "invalid"; errors: string[] }
  | { type: "error"; message: string }
  | { type: "copied"; message: string }
  | {
      type: "workOrders";
      orders: WorkOrder[];
      queuePath: string;
      currentHash: string;
    }
  | { type: "workOrderAdded"; id: string; requirement: string }
  | { type: "sceneHistory"; entries: SceneChangeEntry[]; journalPath: string }
  | { type: "workOrderSelected"; ids: string[] }
  | { type: "elementPasted"; ids: string[] }
  | { type: "exportRequest" };

export const coordinatesFor = (mode: Mode) =>
  mode === "2d"
    ? "x-right y-down; logical pixels; rotation radians about z"
    : "right-handed x-right y-up z-toward-viewer; rotation XYZ Euler radians";
export const newId = () => globalThis.crypto.randomUUID();
export function createScene(mode: Mode): Scene {
  return {
    schema: "three-interact.scene",
    version: 1,
    id: newId(),
    mode,
    units: mode === "2d" ? "px" : "m",
    coordinates: coordinatesFor(mode),
    elements: {},
  };
}
export function createElement(
  type: ElementType,
  mode: Mode,
  id: string = newId(),
): SceneElement {
  const properties: SceneElement["properties"] = {
    fill: "#60a5fa",
    opacity: 1,
  };
  if (mode === "2d")
    Object.assign(properties, { stroke: "#1e3a5f", strokeWidth: 2 });
  switch (type) {
    case "rect":
      Object.assign(properties, { width: 160, height: 100 });
      break;
    case "image":
      Object.assign(properties, mode === "3d" ? { width: 2, height: 1.25 } : { width: 160, height: 100 });
      break;
    case "viewport3d": {
      const embedded = createScene("3d"), box = createElement("box", "3d");
      embedded.elements[box.id] = box;
      Object.assign(properties, { width: 320, height: 240, background: "#ffffff", scene: embedded });
      break;
    }
    case "ellipse":
      Object.assign(properties, { width: 120, height: 80 });
      break;
    case "line":
      Object.assign(properties, {
        points: [
          [0, 0],
          [140, 80],
        ],
      });
      break;
    case "polyline":
      Object.assign(properties, {
        points: [
          [0, 80],
          [70, 0],
          [140, 80],
        ],
        fill: "none",
      });
      break;
    case "path":
      Object.assign(properties, { d: "M 0 80 Q 70 -40 140 80", fill: "none" });
      break;
    case "text":
      Object.assign(properties, { text: "Text", fontSize: 28, stroke: "none", strokeWidth: 0 });
      break;
    case "box":
      Object.assign(properties, { width: 1, height: 1, depth: 1 });
      break;
    case "sphere":
      Object.assign(properties, { radius: 0.6 });
      break;
    case "cylinder":
      Object.assign(properties, { radius: 0.5, height: 1.2 });
      break;
    case "plane":
      Object.assign(properties, { width: 2, height: 2 });
      break;
  }
  return {
    id,
    name: type,
    type,
    visible: true,
    locked: false,
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
    properties,
  };
}

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const types2d = new Set([
  "rect",
  "ellipse",
  "line",
  "polyline",
  "path",
  "text",
  "image",
  "viewport3d",
  "group",
]);
const types3d = new Set(["box", "sphere", "cylinder", "plane", "image", "group"]);
function requireThat(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function validPath(path: unknown): boolean {
  if (
    typeof path !== "string" ||
    path.length > 100000 ||
    !/^\s*[Mm]/.test(path)
  )
    return false;
  const token =
    /[MmZzLlHhVvCcSsQqTtAa]|[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;
  const tokens: string[] = [];
  let end = 0;
  for (const match of path.matchAll(token)) {
    if (!/^[\s,]*$/.test(path.slice(end, match.index))) return false;
    tokens.push(match[0]);
    end = match.index! + match[0].length;
  }
  if (!/^[\s,]*$/.test(path.slice(end))) return false;
  const arity: Record<string, number> = {
    M: 2,
    L: 2,
    H: 1,
    V: 1,
    C: 6,
    S: 4,
    Q: 4,
    T: 2,
    A: 7,
    Z: 0,
  };
  let i = 0;
  while (i < tokens.length) {
    const command = tokens[i++].toUpperCase();
    const count = arity[command];
    if (count === undefined) return false;
    if (!count) continue;
    let groups = 0;
    while (i < tokens.length && !/^[a-z]$/i.test(tokens[i])) {
      const values = tokens.slice(i, i + count).map(Number);
      if (values.length !== count || !values.every(Number.isFinite))
        return false;
      if (
        command === "A" &&
        (values[0] < 0 ||
          values[1] < 0 ||
          ![0, 1].includes(values[3]) ||
          ![0, 1].includes(values[4]))
      )
        return false;
      i += count;
      groups++;
    }
    if (!groups) return false;
  }
  return tokens.length > 0;
}
function record(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
const finite = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
export function isSafeAssetPath(src: string): boolean {
  return (
    src.length > 0 &&
    src.length < 1024 &&
    !src.includes("\\") &&
    !src.includes(":") &&
    !/[?#\x00-\x1f]/.test(src) &&
    !src.startsWith("/") &&
    src.split("/").every((p) => p !== ".." && p !== "." && !!p) &&
    /\.(png|jpe?g)$/i.test(src)
  );
}
export function validateScene(value: unknown): asserts value is Scene {
  requireThat(record(value), "Scene must be a JSON object.");
  requireThat(
    value.schema === "three-interact.scene" && value.version === 1,
    "Expected three-interact.scene version 1.",
  );
  requireThat(
    typeof value.id === "string" && UUID.test(value.id),
    "Document id must be a UUID.",
  );
  requireThat(
    value.mode === "2d" || value.mode === "3d",
    "Scene mode must be 2d or 3d.",
  );
  requireThat(
    value.coordinates === coordinatesFor(value.mode),
    "Coordinate convention does not match the scene mode.",
  );
  requireThat(
    typeof value.units === "string" &&
      value.units.length > 0 &&
      value.units.length <= 32 &&
      (value.mode !== "2d" || value.units === "px"),
    "2D units must be px; 3D units must be a nonempty label.",
  );
  requireThat(
    record(value.elements) && Object.keys(value.elements).length <= 10000,
    "Elements must be an object containing at most 10000 elements.",
  );
  const allowed = value.mode === "2d" ? types2d : types3d;
  let aggregateElements = Object.keys(value.elements).length, viewportCount = 0;
  for (const [id, element] of Object.entries(value.elements)) {
    requireThat(
      UUID.test(id) && record(element) && element.id === id,
      `Element key/id mismatch or invalid UUID: ${id}`,
    );
    requireThat(
      typeof element.name === "string" && element.name.length <= 512,
      `${id}: name must be text (max 512 characters).`,
    );
    requireThat(
      allowed.has(element.type),
      `${id}: unsupported ${value.mode} type ${element.type}.`,
    );
    requireThat(
      typeof element.visible === "boolean" &&
        typeof element.locked === "boolean",
      `${id}: visible and locked must be booleans.`,
    );
    if (element.parent !== undefined)
      requireThat(
        typeof element.parent === "string" &&
          element.parent !== id &&
          value.elements[element.parent]?.type === "group",
        `${id}: parent must reference another group.`,
      );
    requireThat(record(element.transform), `${id}: transform is required.`);
    for (const key of ["position", "rotation", "scale"]) {
      const vector = element.transform[key];
      requireThat(
        Array.isArray(vector) && vector.length === 3 && vector.every(finite),
        `${id}: ${key} must contain three finite numbers.`,
      );
    }
    requireThat(
      element.transform.scale.every((n: number) => n > 0),
      `${id}: scale must be positive.`,
    );
    if (value.mode === "2d")
      requireThat(
        element.transform.position[2] === 0 &&
          element.transform.rotation[0] === 0 &&
          element.transform.rotation[1] === 0 &&
          element.transform.scale[2] === 1,
        `${id}: 2D transforms must stay on the XY plane.`,
      );
    requireThat(
      record(element.properties),
      `${id}: properties must be an object.`,
    );
    const p = element.properties;
    validateStyle(p);
    for (const key of ["width", "height", "depth", "radius", "fontSize"])
      if (p[key] !== undefined)
        requireThat(
          finite(p[key]) && p[key] > 0,
          `${id}: ${key} must be positive.`,
        );
    if (p.strokeWidth !== undefined)
      requireThat(
        finite(p.strokeWidth) && p.strokeWidth >= 0,
        `${id}: strokeWidth must be nonnegative.`,
      );
    if (p.opacity !== undefined)
      requireThat(
        finite(p.opacity) && p.opacity >= 0 && p.opacity <= 1,
        `${id}: opacity must be between 0 and 1.`,
      );
    if (p.textAnchor !== undefined)
      requireThat(
        p.textAnchor === "start" ||
          p.textAnchor === "middle" ||
          p.textAnchor === "end",
        `${id}: textAnchor must be start, middle or end.`,
      );
    if (p.fontWeight !== undefined)
      requireThat(
        finite(p.fontWeight) &&
          Number.isInteger(p.fontWeight) &&
          p.fontWeight >= 100 &&
          p.fontWeight <= 900 &&
          p.fontWeight % 100 === 0,
        `${id}: fontWeight must be a numeric CSS weight from 100 to 900.`,
      );
    for (const key of ["fill", "stroke"])
      if (p[key] !== undefined)
        requireThat(
          typeof p[key] === "string" &&
            /^(#[0-9a-f]{3,8}|[a-z]+|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\))$/i.test(
              p[key],
            ),
          `${id}: ${key} must be a color or none, not a resource URL.`,
        );
    const required: Record<string, string[]> = {
      rect: ["width", "height"],
      ellipse: ["width", "height"],
      image: ["width", "height"],
      viewport3d: ["width", "height"],
      box: ["width", "height", "depth"],
      sphere: ["radius"],
      cylinder: ["radius", "height"],
      plane: ["width", "height"],
      text: ["fontSize"],
    };
    for (const key of required[element.type] || [])
      requireThat(finite(p[key]) && p[key] > 0, `${id}: ${key} is required.`);
    if (element.type === "line" || element.type === "polyline")
      requireThat(
        Array.isArray(p.points) &&
          p.points.length >= 2 &&
          p.points.length <= 10000 &&
          (element.type !== "line" || p.points.length === 2) &&
          p.points.every(
            (point: unknown) =>
              Array.isArray(point) && point.length === 2 && point.every(finite),
          ),
        `${id}: points must contain valid XY coordinates.`,
      );
    if (element.type === "path")
      requireThat(
        validPath(p.d),
        `${id}: path must contain SVG path commands only.`,
      );
    if (element.type === "text")
      requireThat(
        typeof p.text === "string" && p.text.length <= 100000,
        `${id}: text is required (max 100000 characters).`,
      );
    if (element.type === "image")
      requireThat(
        typeof p.src === "string" && isSafeAssetPath(p.src),
        `${id}: image src must be a relative PNG/JPEG path without traversal.`,
      );
    if (element.type === "viewport3d") {
      requireThat(record(p.scene) && p.scene.mode === "3d", `${id}: viewport requires an embedded 3D scene.`);
      validateScene(p.scene);
      aggregateElements += Object.keys(p.scene.elements).length;
      requireThat(aggregateElements <= 10000 && ++viewportCount <= 32, "Mixed figures support at most 10000 total elements and 32 3D viewports.");
      requireThat(p.width <= 10000 && p.height <= 10000, `${id}: viewport dimensions must be at most 10000 pixels.`);
      if (p.background !== undefined) requireThat(typeof p.background === "string" && /^#[0-9a-f]{6}$/i.test(p.background), `${id}: viewport background must be a hex color.`);
      if (p.camera !== undefined) {
        requireThat(record(p.camera) && ["position", "target"].every((key) => Array.isArray(p.camera[key]) && p.camera[key].length === 3 && p.camera[key].every(finite)), `${id}: camera position and target must contain finite XYZ values.`);
        requireThat(p.camera.position.some((n: number, i: number) => Math.abs(n - p.camera.target[i]) > 1e-9), `${id}: camera position and target must differ.`);
      }
    }
  }
  for (const element of Object.values(value.elements) as SceneElement[]) {
    const visited = new Set<string>([element.id]);
    let parent = element.parent;
    while (parent) {
      requireThat(
        !visited.has(parent) && visited.size < 64,
        `${element.id}: cyclic or excessively deep group hierarchy.`,
      );
      visited.add(parent);
      parent = value.elements[parent].parent;
    }
  }
}
export function parseScene(text: string): Scene {
  requireThat(
    text.length <= 16 * 1024 * 1024,
    "Scene exceeds the 16 MB document limit.",
  );
  const value: unknown = JSON.parse(text);
  const tree = parseTree(text);
  function duplicateKeys(node: JsonNode | undefined): void {
    if (!node) return;
    if (node.type === "object") {
      const keys = new Set<string>();
      for (const property of node.children || []) {
        const key = property.children?.[0].value;
        requireThat(!keys.has(key), `Duplicate JSON key: ${key}`);
        keys.add(key);
      }
    }
    for (const child of node.children || []) duplicateKeys(child);
  }
  duplicateKeys(tree);
  validateScene(value);
  return value;
}
export function assertVersion(current: number, expected: number): void {
  requireThat(
    Number.isInteger(expected) && current === expected,
    "Document changed. Wait for the refreshed scene and try again.",
  );
}
export function ancestors(scene: Scene, id: string): SceneElement[] {
  const result: SceneElement[] = [];
  let parent = scene.elements[id]?.parent;
  while (parent) {
    const element = scene.elements[parent];
    if (!element) break;
    result.unshift(element);
    parent = element.parent;
  }
  return result;
}
export function isLocked(scene: Scene, id: string): boolean {
  return (
    !!scene.elements[id]?.locked || ancestors(scene, id).some((e) => e.locked)
  );
}
export function isVisible(scene: Scene, id: string): boolean {
  return (
    !!scene.elements[id]?.visible &&
    ancestors(scene, id).every((e) => e.visible)
  );
}
export function selectedRoots(scene: Scene, ids: string[]): string[] {
  const selected = new Set(ids);
  return [...selected].filter(
    (id) =>
      scene.elements[id] &&
      !ancestors(scene, id).some((e) => selected.has(e.id)),
  );
}
export function applyOperation(scene: Scene, operation: Operation): Scene {
  requireThat(record(operation), "Invalid editor operation.");
  const next = structuredClone(scene);
  const get = (id: string) => {
    requireThat(
      typeof id === "string" && !!next.elements[id],
      `Unknown element: ${id}`,
    );
    return next.elements[id];
  };
  switch (operation.kind) {
    case "insertMany": {
      requireThat(
        Array.isArray(operation.elements) &&
          operation.elements.length > 0 &&
          operation.elements.length <= 257,
        "Invalid component insertion.",
      );
      const ids = new Set<string>();
      for (const element of operation.elements) {
        requireThat(
          record(element) &&
            typeof element.id === "string" &&
            !next.elements[element.id] &&
            !ids.has(element.id),
          "Component elements must have unique new IDs.",
        );
        ids.add(element.id);
      }
      for (const element of operation.elements) {
        if (element.parent && scene.elements[element.parent])
          requireThat(
            !isLocked(scene, element.parent),
            "Cannot insert into a locked group.",
          );
        next.elements[element.id] = structuredClone(element);
      }
      break;
    }
    case "insert": {
      requireThat(
        record(operation.element) && !next.elements[operation.element.id],
        "Inserted element must have a new ID.",
      );
      if (operation.element.parent)
        requireThat(
          !isLocked(scene, operation.element.parent),
          "Cannot insert into a locked group.",
        );
      next.elements[operation.element.id] = structuredClone(operation.element);
      break;
    }
    case "update": {
      requireThat(
        Array.isArray(operation.updates) && operation.updates.length <= 10000,
        "Invalid updates.",
      );
      for (const { id, changes } of operation.updates) {
        const element = get(id);
        requireThat(record(changes), "Invalid changes.");
        requireThat(
          Object.keys(changes).every((key) =>
            [
              "name",
              "parent",
              "visible",
              "locked",
              "transform",
              "properties",
            ].includes(key),
          ),
          "Cannot change identity or type through a property edit.",
        );
        const substantive = Object.keys(changes).some(
          (key) => key !== "locked" && key !== "visible",
        );
        requireThat(
          !substantive || !isLocked(scene, id),
          "Unlock the element and its parent groups before editing.",
        );
        if (changes.parent)
          requireThat(
            !isLocked(scene, changes.parent),
            "Cannot move into a locked group.",
          );
        next.elements[id] = {
          ...element,
          ...structuredClone(changes),
          parent: changes.parent ?? element.parent,
          properties: changes.properties
            ? { ...element.properties, ...structuredClone(changes.properties) }
            : element.properties,
        };
        if (changes.parent == null && Object.hasOwn(changes, "parent"))
          delete next.elements[id].parent;
      }
      break;
    }
    case "delete":
    case "duplicate": {
      requireThat(
        Array.isArray(operation.ids) && operation.ids.length <= 10000,
        "Invalid selection.",
      );
      operation.ids.forEach(get);
      const roots = selectedRoots(scene, operation.ids);
      const affected = Object.values(scene.elements).filter(
        (e) =>
          roots.includes(e.id) ||
          ancestors(scene, e.id).some((p) => roots.includes(p.id)),
      );
      if (operation.kind === "delete") {
        requireThat(
          affected.every((e) => !isLocked(scene, e.id)),
          "Unlock selected elements and descendants before deleting.",
        );
        affected.forEach((e) => delete next.elements[e.id]);
      } else {
        const remap = new Map(affected.map((e) => [e.id, newId()]));
        for (const element of affected) {
          const copy = structuredClone(element);
          copy.id = remap.get(element.id)!;
          copy.name += " copy";
          if (copy.parent && remap.has(copy.parent))
            copy.parent = remap.get(copy.parent);
          if (roots.includes(element.id)) {
            requireThat(
              !copy.parent || !isLocked(scene, copy.parent),
              "Cannot duplicate into a locked group.",
            );
            copy.transform.position[0] += scene.mode === "2d" ? 20 : 0.5;
          }
          next.elements[copy.id] = copy;
        }
      }
      break;
    }
    default:
      throw new Error("Unknown editor operation.");
  }
  validateScene(next);
  return next;
}
