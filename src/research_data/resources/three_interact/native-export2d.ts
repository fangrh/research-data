import pathBounds from "svg-path-bounds";
import {
  ancestors,
  isVisible,
  validateScene,
  type Scene,
  type SceneElement,
} from "./model";
import { imageDimensions } from "./sceneAssets";
import { styleAttrs, gradientDefs, clipStyle } from "./svgStyle";
const esc = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
export function transform2d(e: SceneElement): string {
  const t = e.transform;
  return `translate(${t.position[0]} ${t.position[1]}) rotate(${(t.rotation[2] * 180) / Math.PI}) scale(${t.scale[0]} ${t.scale[1]})`;
}
export function localBounds(e: SceneElement): [number, number, number, number] {
  const p = e.properties;
  if (e.type === "path") return pathBounds(String(p.d));
  if (e.type === "line" || e.type === "polyline") {
    const pts = p.points!;
    return [
      Math.min(...pts.map((p) => p[0])),
      Math.min(...pts.map((p) => p[1])),
      Math.max(...pts.map((p) => p[0])),
      Math.max(...pts.map((p) => p[1])),
    ];
  }
  // Text bounds are conservative, because fonts are resolved by the SVG viewer.
  if (e.type === "text") {
    const s = p.fontSize!;
    // Keep the legacy start/normal bounds exact; add a small slack for heavier
    // weights without pretending to measure the viewer's actual font metrics.
    const width =
      String(p.text).length * s * ((p.fontWeight ?? 400) > 400 ? 1.08 : 1);
    const left =
      p.textAnchor === "middle"
        ? -width / 2
        : p.textAnchor === "end"
          ? -width
          : 0;
    return [left, -s, left + width, s * 0.4];
  }
  return [0, 0, p.width ?? 0, p.height ?? 0];
}
export function sceneBounds(scene: Scene): [number, number, number, number] {
  const points: number[][] = [];
  for (const e of Object.values(scene.elements)) {
    if (e.type === "group" || !isVisible(scene, e.id)) continue;
    const b = localBounds(e),
      pad = (e.properties.strokeWidth ?? 0) / 2;
    const corners = [
      [b[0] - pad, b[1] - pad],
      [b[2] + pad, b[1] - pad],
      [b[2] + pad, b[3] + pad],
      [b[0] - pad, b[3] + pad],
    ];
    const chain = [...ancestors(scene, e.id), e].reverse();
    for (let [x, y] of corners) {
      for (const c of chain) {
        const t = c.transform,
          a = t.rotation[2],
          sx = x * t.scale[0],
          sy = y * t.scale[1];
        x = t.position[0] + Math.cos(a) * sx - Math.sin(a) * sy;
        y = t.position[1] + Math.sin(a) * sx + Math.cos(a) * sy;
      }
      points.push([x, y]);
    }
  }
  if (!points.length) return [0, 0, 800, 600];
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return [minX - 20, minY - 20, maxX - minX + 40, maxY - minY + 40];
}
/** Pure export; assets must be PNG/JPEG data URLs when supplied, never webview URIs. */
export function serializeSvg(
  scene: Scene,
  assets: Record<string, string> = {},
  viewportImages: Record<string, string> = {},
): string {
  validateScene(scene);
  if (scene.mode !== "2d") throw new Error("SVG export requires a 2D drawing.");
  let bytesTotal = 0;
  let defs = "";
  for (const element of Object.values(scene.elements)) {
    if (element.type !== "viewport3d" || !isVisible(scene, element.id)) continue;
    const data = viewportImages[element.id];
    if (typeof data !== "string" || data.length > 32 * 1024 * 1024 ||
        !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(data))
      throw new Error(`Render the 3D viewport before exporting: ${element.name}`);
    const bytes = Uint8Array.from(atob(data.slice(22)), c => c.charCodeAt(0));
    const size = imageDimensions(bytes); bytesTotal += bytes.length;
    if (!size || bytes[4] !== 13 || bytes[5] !== 10 || bytes[6] !== 26 || bytes[7] !== 10 ||
        size.width * size.height > 4 * 1024 * 1024 || bytesTotal > 32 * 1024 * 1024)
      throw new Error("Invalid or oversized 3D viewport PNG.");
  }
  const render = (e: SceneElement): string => {
    if (!e.visible) return "";
    const p = e.properties;
    const attrs = styleAttrs(p); if (p.fillGradient) attrs.fill = `url(#${e.id}-fillGradient)`; if (p.strokeGradient) attrs.stroke = `url(#${e.id}-strokeGradient)`;
    const style = Object.entries(attrs).map(([k,v]) => `${k}="${esc(v)}"`).join(" ");
    defs += gradientDefs(e.id, p); const clip = clipStyle(e.id, p); defs += clip.defs;
    let shape = "";
    switch (e.type) {
      case "rect":
        shape = `<rect width="${p.width}" height="${p.height}" ${style}/>`;
        break;
      case "ellipse":
        shape = `<ellipse cx="${p.width! / 2}" cy="${p.height! / 2}" rx="${p.width! / 2}" ry="${p.height! / 2}" ${style}/>`;
        break;
      case "line":
      case "polyline":
        shape = `<polyline points="${p.points!.map((point) => point.join(",")).join(" ")}" ${style}/>`;
        break;
      case "path":
        shape = `<path d="${esc(p.d)}" ${style}/>`;
        break;
      case "text":
        shape = `<text font-size="${p.fontSize}" font-family="${esc(p.fontFamily ?? "sans-serif")}" font-weight="${p.fontWeight ?? 400}" text-anchor="${p.textAnchor ?? "start"}" xml:space="preserve" ${style}>${esc(p.text)}</text>`;
        break;
      case "image": {
        const src = assets[String(p.src)];
        if (
          !src ||
          !/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+=*$/.test(src)
        )
          throw new Error(
            `Image must be readable and embedded for export: ${p.src}`,
          );
        shape = `<image width="${p.width}" height="${p.height}" href="${src}" opacity="${p.opacity ?? 1}"/>`;
        break;
      }
      case "viewport3d":
        shape = `<image width="${p.width}" height="${p.height}" href="${viewportImages[e.id]}" opacity="${p.opacity ?? 1}"/>`;
        break;
      case "group":
        shape = Object.values(scene.elements)
          .filter((c) => c.parent === e.id)
          .map(render)
          .join("\n");
        break;
    }
    const groupOpacity = e.type === "group" && p.opacity !== undefined ? ` opacity="${esc(p.opacity)}"` : "";
    return `<g id="${e.id}" data-name="${esc(e.name)}" transform="${transform2d(e)}"${groupOpacity}${clip.attr}>${shape ? `<title>${esc(e.name)}</title>${shape}` : ""}</g>`;
  };
  const bounds = sceneBounds(scene);
  const renderedRoots = Object.values(scene.elements)
    .filter((e) => !e.parent)
    .map(render)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.join(" ")}" width="${bounds[2]}" height="${bounds[3]}">\n${defs ? `<defs>${defs}</defs>` : ""}\n${renderedRoots}\n</svg>\n`;
}
