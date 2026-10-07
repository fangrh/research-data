import assert from "node:assert/strict";
import { validateStyle, styleAttrs, gradientDefs, clipStyle } from "../src/research_data/resources/three_interact/native-svgStyle.ts";
import path from "node:path";
import { writeFile, unlink } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const upstreamRoot = path.resolve(process.argv[2] ?? path.join(repoRoot, "..", "three-interact"));

const style = { fill: "#fff", stroke: "#123456", strokeDasharray: [4, 2], strokeLinecap: "round", strokeLinejoin: "bevel", fillOpacity: .4, strokeOpacity: .8, fontStyle: "italic", fontFamily: "Arial", fillRule: "evenodd", clipRects: [{ x: 0, y: 0, width: 10, height: 20, matrix: [1,0,0,1,2,3] }], fillGradient: { type: "linear", units: "objectBoundingBox", x1: 0, y1: 0, x2: 1, y2: 1, stops: [{ offset: 0, color: "#000" }, { offset: 1, color: "#fff", opacity: .5 }] } };
validateStyle(style);
assert.equal(styleAttrs(style)["stroke-dasharray"], "4 2");
assert.match(gradientDefs("e", style), /linearGradient id="e-fillGradient"/);
assert.match(clipStyle("e", style).defs, /clipPath id="e-clip-0"/);
assert.match(clipStyle("e", { clipRects: [{ x: 0, y: 0, width: 10, height: 10 }, { x: 1, y: 1, width: 5, height: 5 }] }).defs, /clipPath id="e-clip-1"><g clip-path="url\(#e-clip-0\)">/);
for (const bad of [{ strokeDasharray: [-1] }, { strokeLinecap: "dash" }, { fontFamily: "<bad>" }, { clipRects: [{ x: 0, y: 0, width: -1, height: 2 }] }, { fillGradient: { type: "linear", units: "objectBoundingBox", x1: 0, y1: 0, x2: 1, y2: 1, stops: [] } }]) assert.throws(() => validateStyle(bad));
console.log("native style overlay: ok");

const { build } = await import(pathToFileURL(path.join(upstreamRoot, "node_modules", "esbuild", "lib", "main.js")).href);
const bundled = await build({
  entryPoints: [path.join(repoRoot, "src", "research_data", "resources", "three_interact", "native-model.ts")],
  bundle: true, format: "cjs", platform: "node", write: false,
  nodePaths: [path.join(upstreamRoot, "node_modules")], external: ["jsonc-parser"],
  plugins: [{ name: "overlay-aliases", setup(b) {
    b.onResolve({ filter: /svgStyle$/ }, () => ({ path: path.join(repoRoot, "src", "research_data", "resources", "three_interact", "native-svgStyle.ts") }));
    b.onResolve({ filter: /workOrders$/ }, () => ({ path: path.join(upstreamRoot, "src", "workOrders.ts") }));
  } }],
});
const modelFile = path.join(upstreamRoot, ".native-model-check.cjs");
await writeFile(modelFile, bundled.outputFiles[0].text, "utf8");
const loadedModel = await import(pathToFileURL(modelFile).href);
const model = loadedModel.default ?? loadedModel;
await unlink(modelFile);
const id = crypto.randomUUID();
const scene = model.createScene("2d");
const element = model.createElement("text", "2d", id);
element.properties.fontFamily = "Arial";
element.properties.clipRects = [{ x: 0, y: 0, width: 10, height: 10 }, { x: 1, y: 1, width: 5, height: 5 }];
element.properties.fillGradient = { type: "linear", units: "objectBoundingBox", x1: 0, y1: 0, x2: 1, y2: 1, stops: [{ offset: 0, color: "#000" }, { offset: 1, color: "#fff" }] };
scene.elements[id] = element;
model.validateScene(scene);
console.log("native model validation: ok");

const exportBundle = await build({
  entryPoints: [path.join(repoRoot, "src", "research_data", "resources", "three_interact", "native-export2d.ts")],
  bundle: true, format: "cjs", platform: "node", write: false,
  nodePaths: [path.join(upstreamRoot, "node_modules")], external: ["jsonc-parser"],
  plugins: [{ name: "export-overlay-aliases", setup(b) {
    b.onResolve({ filter: /model$/ }, () => ({ path: path.join(repoRoot, "src", "research_data", "resources", "three_interact", "native-model.ts") }));
    b.onResolve({ filter: /svgStyle$/ }, () => ({ path: path.join(repoRoot, "src", "research_data", "resources", "three_interact", "native-svgStyle.ts") }));
    b.onResolve({ filter: /sceneAssets$/ }, () => ({ path: path.join(upstreamRoot, "src", "sceneAssets.ts") }));
    b.onResolve({ filter: /workOrders$/ }, () => ({ path: path.join(upstreamRoot, "src", "workOrders.ts") }));
  } }],
});
const exportFile = path.join(upstreamRoot, ".native-export-check.cjs");
await writeFile(exportFile, exportBundle.outputFiles[0].text, "utf8");
const loadedExport = await import(pathToFileURL(exportFile).href);
const exporter = loadedExport.default ?? loadedExport;
await unlink(exportFile);
const svg = exporter.serializeSvg(scene);
assert.match(svg, /<defs>[\s\S]*linearGradient id="[^"]+-fillGradient"/);
assert.match(svg, /clipPath id="[^"]+-clip-0"/);
assert.match(svg, /clipPath id="[^"]+-clip-1"[\s\S]*clip-path="url\(#[^"]+-clip-0\)"/);
console.log("native SVG export defs: ok");
