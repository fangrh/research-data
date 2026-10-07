import {
  type Scene,
  type SceneElement,
  type ElementType,
  type ClientMessage,
  type HostMessage,
  type Operation,
  createElement,
  isLocked,
  ancestors,
  selectedRoots,
} from "../src/model";
import { Renderer2D } from "./renderer2d";
import { Renderer3D } from "./renderer3d";
import { Viewport3DManager } from "./viewport3d";
import type { SceneChangeEntry, WorkOrder } from "../src/workOrders";
import {
  builtInComponents,
  instantiateComponent,
  type ComponentEntry,
} from "../src/components";
import { ComponentNavigator } from "./componentNavigator";
import { renderChangeSummary, renderOrderEvidence } from "./journalSummary";
import { composeAgentBrief, AGENT_BRIEF_LIMIT } from "./agentBrief";
declare global {
  interface Window {
    acquireVsCodeApi: () => {
      postMessage: (message: ClientMessage) => void;
      getState: () => any;
      setState: (state: unknown) => void;
    };
  }
}
const actionIcons: Record<string, string> = {
  fit: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8z"/>',
  duplicate:
    '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
  delete: '<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-2-15-4 18"/>',
  export: '<path d="M12 16V3m-4 4 4-4 4 4M4 14v7h16v-7"/>',
  components:
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  inspector: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
  orders: '<rect x="5" y="4" width="15" height="17" rx="2"/><path d="M9 2h7v4H9zM9 11h7M9 16h7"/>',
  history: '<path d="M3 10a9 9 0 1 1 2 9M3 4v6h6M12 7v6l4 2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  move: '<path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/>',
  rotate: '<path d="M5 8a8 8 0 1 1-1 7M5 3v5h5"/>',
};
const icon = (name: string, className = "button-icon") =>
  `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${actionIcons[name] ?? actionIcons.components}</svg>`;
const api = window.acquireVsCodeApi();
const saved = api.getState?.() ?? {};
let dockWidth = typeof saved.dockWidth === "number" && Number.isFinite(saved.dockWidth)
  ? Math.max(240, Math.min(480, saved.dockWidth)) : 320;
let briefOpen = typeof saved.briefOpen === "boolean" ? saved.briefOpen
  : Boolean(saved.instruction || saved.briefKeep || saved.briefSuccess);
let showTips = saved.showTips !== false;
let gridVisible = saved.gridVisible !== false;
document.body.dataset.tips = showTips ? "shown" : "hidden";
let theme: "black" | "vscode" | "light" =
  saved.themePreferenceVersion === 1 &&
  (saved.theme === "black" || saved.theme === "light")
    ? saved.theme
    : "vscode";
const collapsedGroups = new Set<string>(
  Array.isArray(saved.collapsedGroups)
    ? saved.collapsedGroups.filter((id: unknown) => typeof id === "string")
    : [],
);
document.body.innerHTML = `<header><div class="brand"><span class="brand-icon">◈</span><strong>Three Interact</strong><span id="mode" class="badge"></span></div><nav><button data-testid="fit-scene" title="Fit the scene">Fit</button><button data-testid="duplicate">Duplicate</button><button data-testid="delete">Delete</button><button data-testid="reveal-json">Reveal Source</button><button data-testid="export">Export</button></nav></header><main><section class="stage"><div id="canvas"></div><div id="warning" role="status" hidden></div><div class="handoff"><label for="instruction">INSTRUCTION FOR YOUR AGENT</label><textarea id="instruction" rows="2" placeholder="e.g. Move this element to the right and change its color"></textarea><div class="handoff-actions"><span>References include stable IDs and the current document snapshot.</span><button data-testid="copy-reference">Copy Reference</button><button data-testid="copy-ai" class="primary">Copy Selection for AI</button></div></div></section><aside class="right"><section class="scene-list"><h2>SCENE ELEMENTS <span id="count"></span></h2><div id="tree" role="tree" aria-label="Scene elements" aria-multiselectable="true"></div></section><h2 id="panel-heading">INSPECTOR</h2><div id="inspector"></div><div class="help">Click or press Enter to select · Shift for multiple<br>2D: drag background to pan · wheel to zoom<br>3D: drag to orbit · wheel to zoom</div></aside><aside class="tool-rail" aria-label="Insert elements"><h2 class="sr-only">Insert elements</h2><div id="insert-buttons" class="insert-grid"></div></aside></main><footer><span id="status">Opening scene…</span><span id="units"></span></footer>`;
for (const [testId, iconName] of Object.entries({
  "fit-scene": "fit",
  duplicate: "duplicate",
  delete: "delete",
  "reveal-json": "code",
  export: "export",
})) {
  const button = document.querySelector<HTMLButtonElement>(
    `[data-testid="${testId}"]`,
  )!;
  const label = button.textContent ?? "";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = `${icon(iconName)}<span class="button-label">${label}</span>`;
}
document.body.dataset.theme = theme;
const themeSelect = document.createElement("select");
themeSelect.id = "theme-select";
themeSelect.setAttribute("aria-label", "Theme");
themeSelect.title = "Editor theme";
themeSelect.innerHTML =
  '<option value="vscode">VS Code</option><option value="black">Black</option><option value="light">Light</option>';
themeSelect.value = theme;
document.querySelector("header nav")!.prepend(themeSelect);
const gridToggle = document.createElement("button");
gridToggle.type = "button";
gridToggle.dataset.testid = "toggle-grid";
gridToggle.textContent = "Grid";
gridToggle.title = "Show or hide the 3D grid";
gridToggle.style.display = "none";
gridToggle.setAttribute("aria-label", "Show or hide the 3D grid");
gridToggle.setAttribute("aria-pressed", String(gridVisible));
document.querySelector("header nav")!.append(gridToggle);
gridToggle.onclick = () => {
  gridVisible = !gridVisible;
  gridToggle.setAttribute("aria-pressed", String(gridVisible));
  if (renderer instanceof Renderer3D) renderer.setGridVisible(gridVisible);
  saveUiState();
};
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
const canvas = $("#canvas"),
  tree = $("#tree"),
  inspector = $("#inspector"),
  instruction = $<HTMLTextAreaElement>("#instruction");
const rightPanel = $<HTMLElement>(".right");
canvas.tabIndex = 0;
canvas.setAttribute("aria-label", "Scene canvas");
const canvasCaption = document.createElement("div");
canvasCaption.className = "canvas-caption";
canvasCaption.setAttribute("aria-hidden", "true");
canvas.before(canvasCaption);

const sidebarActions = document.createElement("section");
sidebarActions.className = "sidebar-actions";
sidebarActions.innerHTML = `<h2>IMAGES & COMPONENTS</h2><button type="button" data-testid="sidebar-insert-image">Insert image…</button><button type="button" data-testid="sidebar-hide-selection">Hide selected</button><div class="reference-actions"><button type="button" data-testid="order-modify">Modify selected</button><button type="button" data-testid="order-similar">Create similar</button></div><details class="sidebar-help"><summary>How to use</summary><p class="hint">Insert a PNG or JPEG in a 2D drawing. Drag to move, use square grips to resize or the round handle to rotate. Hold Shift to snap rotation; enter degrees in Properties. Tab reaches controls. On the canvas, arrow keys move the selection; Shift moves farther. Hide groups to hide their components.</p></details></section>`;
rightPanel.prepend(sidebarActions);
const sceneSearch = document.createElement("input");
sceneSearch.type = "search";
sceneSearch.id = "scene-search";
sceneSearch.placeholder = "Find elements…";
sceneSearch.setAttribute("aria-label", "Find scene elements");
$("#tree").before(sceneSearch);
sceneSearch.oninput = () => {
  renderTree();
  renderControls();
};

const orderIntent = document.createElement("select");
orderIntent.id = "order-intent";
orderIntent.setAttribute("aria-label", "Work order action");
orderIntent.innerHTML =
  '<option value="custom">As described</option><option value="modify">Modify selected</option><option value="similar">Create similar</option>';
orderIntent.value =
  saved.orderIntent === "similar" || saved.orderIntent === "modify"
    ? saved.orderIntent
    : "custom";
$(".handoff > label").after(orderIntent);

rightPanel.before($(".tool-rail"));
const dockResize = document.createElement("div");
dockResize.id = "dock-resize";
dockResize.tabIndex = 0;
dockResize.setAttribute("role", "separator");
dockResize.setAttribute("aria-label", "Resize properties and library dock");
dockResize.setAttribute("aria-orientation", "vertical");
dockResize.setAttribute("aria-controls", "right-dock");
dockResize.title = "Drag to resize the dock. Left/Right arrows adjust width. Double-click to reset.";
rightPanel.id = "right-dock";
rightPanel.before(dockResize);
let dockDrag: { pointer: number; x: number; width: number } | undefined;
function applyDockWidth() {
  const max = Math.max(240, Math.min(480, window.innerWidth - 232));
  const width = Math.min(dockWidth, max);
  $("main").style.setProperty("--dock-width", `${width}px`);
  dockResize.setAttribute("aria-valuemin", "240");
  dockResize.setAttribute("aria-valuemax", String(max));
  dockResize.setAttribute("aria-valuenow", String(width));
  dockResize.setAttribute("aria-valuetext", `${width} pixels`);
  const compact = window.innerWidth <= 650;
  dockResize.setAttribute("aria-disabled", String(compact));
  dockResize.tabIndex = compact ? -1 : 0;
}
function adjustDockWidth(width: number) {
  dockWidth = Math.max(240, Math.min(480, window.innerWidth - 232, width));
  applyDockWidth();
}
applyDockWidth();
window.addEventListener("resize", applyDockWidth);
dockResize.addEventListener("keydown", (event) => {
  if (window.innerWidth <= 650 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  const width = Number(dockResize.getAttribute("aria-valuenow"));
  adjustDockWidth(event.key === "Home" ? 240 : event.key === "End" ? 480 : width + (event.key === "ArrowLeft" ? 10 : -10));
  saveUiState();
});
dockResize.addEventListener("dblclick", () => {
  if (window.innerWidth <= 650) return;
  adjustDockWidth(320);
  saveUiState();
});
dockResize.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || window.innerWidth <= 650) return;
  event.preventDefault();
  dockDrag = { pointer: event.pointerId, x: event.clientX, width: Number(dockResize.getAttribute("aria-valuenow")) };
  dockResize.setPointerCapture(event.pointerId);
  document.body.classList.add("resizing-dock");
});
dockResize.addEventListener("pointermove", (event) => {
  if (dockDrag?.pointer === event.pointerId) adjustDockWidth(dockDrag.width + dockDrag.x - event.clientX);
});
const finishDockResize = () => {
  if (!dockDrag) return;
  dockDrag = undefined;
  document.body.classList.remove("resizing-dock");
  saveUiState();
};
dockResize.addEventListener("pointerup", finishDockResize);
dockResize.addEventListener("pointercancel", finishDockResize);
dockResize.addEventListener("lostpointercapture", finishDockResize);
const transformPanel = document.createElement("section");
transformPanel.className = "transform-panel";
transformPanel.innerHTML = '<label class="field"><span>Canvas tool</span><select id="transform-tool" data-testid="transform-tool" aria-label="Canvas tool"><option value="translate">Move</option><option value="rotate">Rotate</option><option value="scale">Scale</option></select></label>';
transformPanel.insertAdjacentHTML(
  "beforeend",
  '<p class="transform-hint">Choose a tool, then drag the selected element on the canvas. In 3D, drag a gizmo handle.</p>',
);
const canvasTools = document.createElement("div");
canvasTools.id = "canvas-tools";
canvasTools.className = "canvas-tools";
canvasTools.setAttribute("aria-label", "Edit selected element");
canvasTools.innerHTML = `<button type="button" data-transform-tool="translate" data-testid="tool-move" title="Move (V)" aria-label="Move selected element">${icon("move")}</button><button type="button" data-transform-tool="rotate" data-testid="tool-rotate" title="Rotate (R) — drag the round handle" aria-label="Rotate selected element">${icon("rotate")}</button><button type="button" data-transform-tool="scale" data-testid="tool-resize" title="Resize (S) — drag a square handle" aria-label="Resize selected element">${icon("fit")}</button><button type="button" data-testid="sidebar-delete" class="delete-action" title="Delete selected (Delete)" aria-label="Delete selected element">${icon("close")}</button>`;
$(".tool-rail").append(canvasTools);
canvasTools.querySelectorAll<HTMLButtonElement>("[data-transform-tool]").forEach((button) => {
  button.onclick = () => chooseTool(button.dataset.transformTool as typeof tool);
});
canvasTools.querySelector<HTMLButtonElement>('[data-testid="sidebar-delete"]')!.onclick = () => {
  if (selection.length) sendOperation({ kind: "delete", ids: selection });
};
rightPanel.querySelector(".scene-list")!.after(transformPanel);
const tabBar = document.createElement("div");
tabBar.className = "inspector-tabs";
tabBar.innerHTML =
  '<button type="button" data-panel="inspector" aria-selected="true" aria-controls="inspector">Inspector</button><button type="button" data-panel="components" aria-selected="false" aria-controls="component-navigator">Components</button><button type="button" data-panel="orders" aria-label="Work orders" title="Work orders" aria-selected="false" aria-controls="orders-panel">Orders <span id="order-count">0</span></button><button type="button" data-panel="history" aria-label="History" title="History / Proof: modification journal" aria-selected="false" aria-controls="history-panel">History / Proof <span id="history-count">0</span></button>';
rightPanel.querySelector("#panel-heading")!.replaceWith(tabBar);
rightPanel.prepend(tabBar);
for (const button of tabBar.querySelectorAll<HTMLButtonElement>("[data-panel]")) {
  const label = button.firstChild?.textContent ?? "";
  button.firstChild?.remove();
  button.setAttribute("aria-label", button.getAttribute("aria-label") || label);
  const panel = button.dataset.panel!;
  const labels: Record<string, string> = { inspector: "Inspect", components: "Library", orders: "Orders", history: "History" };
  const tips: Record<string, string> = {
    inspector: "Properties — edit the selected component and choose a canvas tool.",
    components: "Component library — browse and insert reusable 2D and 3D figures.",
    orders: "Work orders — review saved requests for your AI agent and their progress.",
    history: "History / Proof — review modifications and their before/after evidence.",
  };
  button.title = tips[panel];
  button.insertAdjacentHTML("afterbegin", `${icon(panel)}<span class="dock-tab-label">${labels[panel]}</span>`);
}
const dockHeading = document.createElement("h2");
dockHeading.id = "dock-heading";
dockHeading.textContent = "Properties";
const dockHeader = document.createElement("div");
dockHeader.className = "dock-header";
const tipsToggle = document.createElement("button");
tipsToggle.type = "button";
tipsToggle.id = "tips-toggle";
tipsToggle.textContent = "?";
tipsToggle.setAttribute("aria-label", "Show tips");
tipsToggle.setAttribute("aria-pressed", String(showTips));
tipsToggle.title = showTips ? "Hide tips" : "Show tips";
tipsToggle.onclick = () => {
  showTips = !showTips;
  document.body.dataset.tips = showTips ? "shown" : "hidden";
  tipsToggle.setAttribute("aria-pressed", String(showTips));
  tipsToggle.title = showTips ? "Hide tips" : "Show tips";
  saveUiState();
};
dockHeader.append(dockHeading, tipsToggle);
tabBar.after(dockHeader);
const historyActivity = document.createElement("button");
historyActivity.type = "button";
historyActivity.id = "history-activity";
historyActivity.setAttribute("aria-label", "Review latest modification");
historyActivity.hidden = true;
historyActivity.title =
  "Open the latest modification and its before/after evidence";
dockHeader.after(historyActivity);
const sceneList = rightPanel.querySelector<HTMLElement>(".scene-list")!;
historyActivity.after(sceneList);
sceneList.after(inspector, sidebarActions, transformPanel);
const ordersPanel = document.createElement("div");
ordersPanel.id = "orders-panel";
ordersPanel.hidden = true;
rightPanel.append(ordersPanel);
const historyPanel = document.createElement("div");
historyPanel.id = "history-panel";
historyPanel.hidden = true;
rightPanel.append(historyPanel);
rightPanel.append(rightPanel.querySelector(".help")!);
const addWorkOrderButton = document.createElement("button");
addWorkOrderButton.dataset.testid = "add-work-order";
addWorkOrderButton.textContent = "Add work order";
addWorkOrderButton.className = "primary";
$('[data-testid="copy-ai"]').classList.remove("primary");
addWorkOrderButton.title =
  "Save the scene, select targets, and describe the change. Ctrl+Enter to add.";
$(".handoff-actions").append(addWorkOrderButton);
const saveSceneButton = document.createElement("button");
saveSceneButton.type = "button";
saveSceneButton.dataset.testid = "save-scene";
saveSceneButton.textContent = "Save scene";
addWorkOrderButton.before(saveSceneButton);
const orderReadiness = document.createElement("p");
orderReadiness.id = "order-readiness";
orderReadiness.className = "order-readiness";
orderReadiness.setAttribute("role", "status");
$(".handoff-actions").after(orderReadiness);

const briefHeading = document.createElement("div");
briefHeading.className = "brief-heading";
briefHeading.id = "brief-heading";
const briefLabel = $(".handoff > label");
briefLabel.textContent = "Agent brief";
briefLabel.before(briefHeading);
briefHeading.append(briefLabel, orderIntent);
const briefTargets = document.createElement("p");
briefTargets.id = "brief-targets";
briefTargets.className = "brief-targets";
instruction.before(briefTargets);
const historySource = document.createElement("div");
historySource.id = "history-order-source";
historySource.className = "history-source";
historySource.hidden = true;
instruction.before(historySource);
instruction.placeholder =
  "Describe the idea, what should change, and what must stay. The selected 2D or 3D geometry gives your agent the context.";

instruction.value =
  typeof saved.instruction === "string" ? saved.instruction : "";
instruction.maxLength = 11800;
const briefDetails = document.createElement("details");
briefDetails.id = "brief-details";
briefDetails.className = "brief-details";
briefDetails.innerHTML = `<summary>Constraints & success checks <span class="optional">optional</span></summary><div class="brief-fields"><label for="brief-keep">Keep unchanged<textarea id="brief-keep" rows="2" maxlength="2000" placeholder="e.g. Preserve the original, labels and dimensions"></textarea></label><label for="brief-success">Success checks<textarea id="brief-success" rows="2" maxlength="2000" placeholder="e.g. No overlaps; fit the drawing; save a new component"></textarea></label></div>`;
instruction.after(briefDetails);
const briefKeep = $<HTMLTextAreaElement>("#brief-keep");
const briefSuccess = $<HTMLTextAreaElement>("#brief-success");
briefKeep.value = typeof saved.briefKeep === "string" ? saved.briefKeep : "";
briefSuccess.value =
  typeof saved.briefSuccess === "string" ? saved.briefSuccess : "";
briefDetails.open = !!(briefKeep.value || briefSuccess.value);
const briefReview = document.createElement("details");
briefReview.id = "brief-review";
briefReview.className = "brief-review";
briefReview.innerHTML =
  '<summary>Review instruction <span id="brief-length"></span></summary><pre id="brief-preview"></pre>';
briefDetails.after(briefReview);
const briefFooter = document.createElement("div");
briefFooter.className = "brief-footer";
$(".handoff-actions").before(briefFooter);
briefFooter.append($(".handoff-actions"), orderReadiness);
const briefContent = document.createElement("div");
briefContent.id = "brief-content";
briefContent.append(orderIntent);
for (const child of [...$(".handoff").children]) {
  if (child !== briefHeading) briefContent.append(child);
}
$(".handoff").append(briefContent);
const briefToggle = document.createElement("button");
briefToggle.type = "button";
briefToggle.dataset.testid = "toggle-agent-brief";
briefToggle.setAttribute("aria-controls", "brief-content");
briefHeading.append(briefToggle);
function renderBriefVisibility() {
  briefContent.hidden = !briefOpen;
  $(".handoff").classList.toggle("collapsed", !briefOpen);
  briefToggle.textContent = briefOpen ? "Collapse" : "Expand";
  briefToggle.setAttribute("aria-expanded", String(briefOpen));
  briefToggle.setAttribute("aria-label", `${briefOpen ? "Collapse" : "Expand"} agent brief`);
}
function setBriefOpen(open: boolean) {
  briefOpen = open;
  renderBriefVisibility();
  saveUiState();
}
briefToggle.onclick = () => setBriefOpen(!briefOpen);
briefLabel.onclick = () => {
  setBriefOpen(true);
  instruction.focus();
};
renderBriefVisibility();
let briefRevision = 0;
let scene: Scene | undefined,
  version = 0,
  invalid = true,
  dirty = false,
  assets: Record<string, string> = {},
  warnings: string[] = [],
  selection: string[] = [],
  tool: "translate" | "rotate" | "scale" = "translate";
let workOrders: WorkOrder[] = [],
  sceneHistory: SceneChangeEntry[] = [],
  historySequence: number | undefined =
    typeof saved.historySequence === "number" ? saved.historySequence : undefined,
  historyLoaded = false,
  queuePath = "",
  currentHash = "",
  orderBusy = false,
  submittedRevision: number | undefined,
  historyVisibleCount = 50,
  activePanel: "inspector" | "components" | "orders" | "history" =
    saved.panel === "orders" ||
    saved.panel === "history" ||
    saved.panel === "components"
      ? saved.panel
      : "inspector";
let autoSave = false;
let renderer: Renderer2D | Renderer3D | undefined,
  rendererMode: string | undefined,
  rendererTool: "translate" | "rotate" | "scale" | undefined,
  pending = false,
  pendingId: string | undefined,
  pendingTimer: ReturnType<typeof setTimeout> | undefined;
const esc = (x: unknown) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const post = (m: ClientMessage) => api.postMessage(m);
let componentEntries = builtInComponents();
let componentWarnings: string[] = [],
  componentPath = "";
let placement: { entry: ComponentEntry; scale: number } | undefined;
const componentsButton = document.createElement("button");
componentsButton.type = "button";
componentsButton.innerHTML = `${icon("components")}<span class="button-label">Components</span>`;
componentsButton.setAttribute("aria-label", "Components");
componentsButton.title = "Components";
componentsButton.dataset.testid = "components-open";
componentsButton.setAttribute("aria-expanded", "false");
componentsButton.setAttribute("aria-controls", "component-navigator");
$("header nav").prepend(componentsButton);
const componentContainer = document.createElement("div");
componentContainer.id = "components-panel";
rightPanel.append(componentContainer);
const componentNavigator = new ComponentNavigator(componentContainer, {
  onInsert: (entry, scale) => {
    if (!scene || invalid || pending) return;
    placement = { entry, scale };
    canvas.classList.add("component-placement");
    componentNavigator.setOpen(false);
    componentsButton.setAttribute("aria-expanded", "false");
    status(`Click the canvas to place ${entry.name}. Escape cancels.`);
  },
  onInsertCenter: (entry, scale) => {
    const rect = canvas.getBoundingClientRect();
    placeComponent(
      entry,
      scale,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
    componentNavigator.setOpen(false);
    componentsButton.setAttribute("aria-expanded", "false");
  },
  onRefresh: () => post({ type: "componentsRefresh" }),
  onSave: () => post({ type: "componentSave", version, ids: selection }),
  onCopyGuide: () => post({ type: "componentGuideCopy" }),
  onOpenChange: (open) => {
    componentsButton.setAttribute("aria-expanded", String(open));
    if (open && activePanel !== "components") showPanel("components");
    if (!open && activePanel === "components") showPanel("inspector");
  },
});
componentsButton.onclick = () => {
  showPanel(activePanel === "components" ? "inspector" : "components");
};
function cancelPlacement() {
  placement = undefined;
  canvas.classList.remove("component-placement");
}
function placeComponent(
  entry: ComponentEntry,
  scale: number,
  x: number,
  y: number,
) {
  if (!scene || invalid || pending || !renderer || entry.mode !== scene.mode)
    return;
  try {
    const instance = instantiateComponent(
      entry,
      renderer.placementPoint(x, y),
      scale,
    );
    pendingId = instance.rootId;
    sendOperation({ kind: "insertMany", elements: instance.elements });
    cancelPlacement();
  } catch (error) {
    status(String(error), true);
  }
}
let suppressPlacementUp = false;
canvas.addEventListener(
  "pointerdown",
  (event) => {
    if (!placement || event.button !== 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressPlacementUp = true;
    placeComponent(
      placement.entry,
      placement.scale,
      event.clientX,
      event.clientY,
    );
  },
  true,
);
canvas.addEventListener(
  "pointerup",
  (event) => {
    if (suppressPlacementUp) {
      suppressPlacementUp = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);
function saveUiState() {
  api.setState?.({
    instruction: instruction.value,
    briefKeep: briefKeep.value,
    briefSuccess: briefSuccess.value,
    selection,
    theme,
    themePreferenceVersion: 1,
    showTips,
    gridVisible,
    collapsedGroups: [...collapsedGroups],
    panel: activePanel,
    dockWidth,
    briefOpen,
    orderIntent: orderIntent.value,
    historySequence,
  });
}
function status(message: string, bad = false) {
  $("#status").textContent = message;
  $("#status").classList.toggle("bad", bad);
}
function emitSelection() {
  const requirement = agentRequirement(instruction.value);
  post({
    type: "selection",
    ids: selection,
    instruction: requirement.length > AGENT_BRIEF_LIMIT ? "" : requirement,
    instructionTooLong: requirement.length > AGENT_BRIEF_LIMIT,
  });
  saveUiState();
}
function showPanel(panel: "inspector" | "components" | "orders" | "history") {
  const changed = activePanel !== panel;
  activePanel = panel;
  rightPanel.dataset.panel = panel;
  sceneList.hidden = panel === "components";
  dockHeading.textContent = { inspector: "Properties", components: "Components", orders: "Work orders", history: "History / Proof" }[panel];
  inspector.hidden = panel !== "inspector";
  ordersPanel.hidden = panel !== "orders";
  historyPanel.hidden = panel !== "history";
  sidebarActions.hidden = panel !== "inspector";
  transformPanel.hidden = panel !== "inspector";
  componentContainer.hidden = panel !== "components";
  if (componentNavigator.isOpen() !== (panel === "components"))
    componentNavigator.setOpen(panel === "components");
  rightPanel.querySelector<HTMLElement>(".help")!.hidden =
    panel !== "inspector";
  tabBar
    .querySelectorAll<HTMLButtonElement>("[data-panel]")
    .forEach((button) => {
      button.setAttribute(
        "aria-selected",
        String(button.dataset.panel === panel),
      );
    });
  saveUiState();
  if (changed) rightPanel.scrollTop = 0;
  if (panel === "history" && !queuePath) post({ type: "historyRefresh" });
  if (panel === "orders" && !queuePath) post({ type: "workOrderRefresh" });
}
function renderWorkOrders() {
  const expanded = new Set(
    [
      ...ordersPanel.querySelectorAll<HTMLDetailsElement>(
        "details[data-order-id][open]",
      ),
    ].map((item) => item.dataset.orderId),
  );
  $("#order-count").textContent = String(
    workOrders.filter(
      (order) => order.status === "open" || order.status === "started",
    ).length,
  );
  $("#order-count").hidden = $("#order-count").textContent === "0";
  const active = workOrders.filter(
    (order) => order.status === "open" || order.status === "started",
  );
  const journalName = queuePath.split(/[\\/]/).slice(-2).join("/");
  const rows = workOrders.map((order) => {
    const brief = order.requirement
      .replace(
        /^(?:Modify the selected elements\.|Create a new element using the selected elements as references\. Preserve the original elements\.)\s+/,
        "",
      )
      .replace(/\s+/g, " ")
      .trim();
    const title = brief.length > 64 ? `${brief.slice(0, 63)}…` : brief;
    const accessible = brief.length > 200 ? `${brief.slice(0, 199)}…` : brief;
    return `<details class="journal-record order-card" data-status="${esc(order.status)}" data-order-id="${esc(order.id)}" ${expanded.has(order.id) ? "open" : ""}><summary title="${esc(order.requirement)}" aria-label="Work order ${esc(order.id)}: ${esc(accessible)}. Status ${esc(order.status)}"><span class="record-main"><span class="record-title">${esc(title)}</span><span class="order-status">${esc(order.status)}</span></span><span class="record-sub">${esc(order.id)} · ${esc(order.createdAt.slice(0, 16).replace("T", " "))} UTC</span></summary><div class="record-detail"><p>${esc(order.requirement)}</p>${renderOrderEvidence(order, currentHash)}<small>${order.selectedIds.length} target${order.selectedIds.length === 1 ? "" : "s"}</small><div class="order-card-actions"><button type="button" data-order-action="copy" data-order-id="${esc(order.id)}">Copy for agent</button><button type="button" data-order-action="highlight" data-order-id="${esc(order.id)}" ${order.snapshotHash === currentHash ? "" : 'disabled title="Scene changed; review frozen context"'}>Select targets</button></div><details class="proof-data"><summary>Frozen context and activity</summary><pre>${esc(JSON.stringify(order.context, null, 2))}</pre><pre>${esc(JSON.stringify(order.history, null, 2))}</pre></details></div></details>`;
  });
  ordersPanel.innerHTML = `<div class="order-toolbar"><button type="button" data-order-action="copy-open" ${active.length ? "" : "disabled"}>Copy open orders</button><button type="button" data-order-action="refresh">Refresh</button></div><p class="journal-caption" title="${esc(queuePath)}">${active.length} open · ${queuePath ? esc(journalName) : "Loading journal…"}</p>${rows.length ? rows.join("") : '<p class="empty">No work orders for this scene. Select elements, describe the change below the canvas, then add a work order.</p>'}`;
}
function historyEntry(): SceneChangeEntry | undefined {
  return historySequence === undefined
    ? undefined
    : sceneHistory.find((entry) => entry.sequence === historySequence);
}
function decorateOrderCards() {
  for (const order of workOrders) {
    const card = [...ordersPanel.querySelectorAll<HTMLElement>("[data-order-id]")].find(
      (item) => item.dataset.orderId === order.id,
    );
    if (!card) continue;
    const receipt = (order.context as { source?: string; history?: SceneChangeEntry } | undefined);
    const entry =
      receipt?.source === "scene-history" && receipt.history
        ? receipt.history
        : undefined;
    if (entry)
      card
        .querySelector(".record-detail")
        ?.insertAdjacentHTML(
          "afterbegin",
          '<p class="order-history-source">Based on history #' +
            entry.sequence +
            " · " +
            esc(entry.action) +
            "</p>",
        );
    const selectButton = card.querySelector<HTMLButtonElement>(
      '[data-order-action="highlight"]',
    );
    if (
      selectButton &&
      (!order.selectedIds.length ||
        !order.selectedIds.every((id) => !!scene?.elements[id]))
    ) {
      selectButton.disabled = true;
      selectButton.title =
        "Some or all historical targets are no longer in this scene.";
    }
  }
}
function renderHistorySource() {
  const entry = historyEntry();
  if (!entry) {
    historySource.hidden = true;
    historySource.replaceChildren();
    if (historyLoaded && historySequence !== undefined) {
      historySequence = undefined;
      saveUiState();
    }
    return;
  }
  const ids = Object.keys(entry.elements);
  const existing = ids.filter((id) => !!scene?.elements[id]);
  historySource.hidden = false;
  historySource.innerHTML = `<span class="history-source-copy"><strong>Based on history #${entry.sequence} · ${esc(entry.action)}</strong><small>${existing.length} of ${ids.length} changed target${ids.length === 1 ? "" : "s"} still in this scene${ids.length ? "" : " · metadata only"}</small></span><button type="button" data-history-source-action="remove" aria-label="Remove history source">Remove history</button>`;
}
function renderHistory() {
  $("#history-count").textContent = String(sceneHistory.length);
  $("#history-count").hidden = sceneHistory.length === 0;
  const latest = sceneHistory[0];
  historyActivity.hidden = !latest;
  historyActivity.textContent = latest
    ? `Latest change: ${latest.action} · View history`
    : "";
  const expanded = new Set(
    [
      ...historyPanel.querySelectorAll<HTMLDetailsElement>(
        "details[data-history-sequence][open]",
      ),
    ].map((item) => item.dataset.historySequence),
  );
  const journalName = queuePath.split(/[\\/]/).slice(-2).join("/");
  historyPanel.innerHTML = `<div class="order-toolbar"><button type="button" data-history-action="copy">Copy for AI</button><button type="button" data-history-action="refresh">Refresh</button></div><p class="journal-caption" title="${esc(queuePath)}">${sceneHistory.length} change${sceneHistory.length === 1 ? "" : "s"} · ${queuePath ? esc(journalName) : "Loading journal…"}</p>${
    sceneHistory.length
      ? sceneHistory
          .slice(0, historyVisibleCount)
          .map(
            (entry) =>
`<details class="journal-record history-card" data-history-sequence="${entry.sequence}" ${expanded.has(String(entry.sequence)) ? "open" : ""}><summary><span class="record-main"><span class="record-title">#${entry.sequence} ${esc(entry.action)}</span><span class="record-source">${esc(entry.source)}</span></span><span class="record-sub">${esc(entry.at.slice(0, 16).replace("T", " "))} UTC · ${Object.keys(entry.elements).length} element${Object.keys(entry.elements).length === 1 ? "" : "s"}</span></summary><div class="record-detail">${renderChangeSummary(entry)}<div class="history-card-actions"><button type="button" data-history-action="order" data-history-sequence="${entry.sequence}">Use for work order</button></div><details class="proof-data"><summary>Full snapshot evidence</summary><p>Before SHA-256: <code>${esc(entry.beforeTextHash)}</code><br>After SHA-256: <code>${esc(entry.afterTextHash)}</code></p><pre>${esc(JSON.stringify({ beforeMetadata: entry.beforeMetadata, afterMetadata: entry.afterMetadata, elements: entry.elements }, null, 2))}</pre></details></div></details>`,
          )
          .join("")
      : '<p class="empty">No scene changes recorded yet. Move, rotate, resize, edit properties, or modify the scene source to create an entry.</p>'
  }${sceneHistory.length > historyVisibleCount ? '<button type="button" data-history-action="more">Show older changes</button>' : ""}`;
  renderHistorySource();
}
function select(id: string | undefined, additive = false) {
  if (!scene) return;
  if (!id) selection = [];
  else if (additive)
    selection = selection.includes(id)
      ? selection.filter((x) => x !== id)
      : [...selection, id];
  else if (!selection.includes(id) || selection.length !== 1) selection = [id];
  if (orderBusy) briefRevision++;
  if (id)
    ancestors(scene, id).forEach((parent) => collapsedGroups.delete(parent.id));
  if (id) showPanel("inspector");
  renderPanels();
  renderCanvas();
  emitSelection();
}
function sendOperation(operation: Operation, expected = version) {
  if (invalid || pending || !scene) return;
  pending = true;
  renderControls();
  renderCanvas();
  post({ type: "edit", version: expected, operation });
  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => {
    pending = false;
    renderControls();
    post({ type: "ready" });
  }, 5000);
}
function edit(
  id: string,
  changes: Extract<Operation, { kind: "update" }>["updates"][number]["changes"],
) {
  sendOperation({ kind: "update", updates: [{ id, changes }] });
}
function renderCanvas() {
  if (!scene) return;
  if (rendererMode !== scene.mode) {
    renderer?.dispose();
    canvas.replaceChildren();
    renderer = undefined;
    rendererMode = scene.mode;
    rendererTool = undefined;
    try {
      const callbacks = {
        activateSelection: () => showPanel("inspector"),
        editViewport: (id: string) => viewportManager.edit(id),
        select: (id: string | undefined, additive: boolean) => {
          const component =
            id &&
            scene &&
            [...ancestors(scene, id), scene.elements[id]].find(
              (e) => e.properties.componentId,
            );
          select(component ? component.id : id, additive);
        },
        commit: (updates: any, originVersion: number) =>
          sendOperation({ kind: "update", updates }, originVersion),
        error: (message: string) => status(message, true),
      };
      renderer =
        scene.mode === "2d"
          ? new Renderer2D(canvas, callbacks)
          : new Renderer3D(canvas, callbacks);
    } catch (e) {
      canvas.textContent =
        "WebGL is unavailable. Use Reveal Source to edit the scene source; enable WebGL to use the 3D viewport.";
      status(String(e), true);
    }
  }
  if (renderer) renderer.setAssets(assets);
  viewportManager.setState(scene, assets, version, invalid || pending);
  if (renderer instanceof Renderer3D) renderer.setGridVisible(gridVisible);
  renderer?.setState(scene, selection, version, invalid || pending);
  if (renderer && rendererTool !== tool) {
    renderer.setTool(tool);
    rendererTool = tool;
  }
}
const viewportManager = new Viewport3DManager({
  previews: images => { if (renderer instanceof Renderer2D) renderer.setViewportImages(images); },
  commit: (operation, version) => sendOperation(operation, version),
  insertImage: (viewportId, version) => post({type: "insertImage", viewportId, version}),
  error: message => status(message, true),
});
function renderControls() {
  gridToggle.style.display = scene?.mode === "3d" ? "" : "none";
  const blocked = invalid || pending;
  const requirement = agentRequirement(instruction.value);
  const briefTooLong = requirement.length > AGENT_BRIEF_LIMIT;
  document.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
    if (button.closest("[data-host-controls]")) return;
    if (button.dataset.panel) {
      button.disabled = false;
      return;
    }
    if (button.dataset.orderAction) return;
    if (button.dataset.rotateStep || button.hasAttribute("data-rotate-reset")) {
      button.disabled =
        blocked ||
        !scene ||
        selection.length !== 1 ||
        isLocked(scene, selection[0]);
      return;
    }

    const action = button.dataset.testid || "";
    button.disabled = blocked && !["fit-scene", "reveal-json"].includes(action);
    if (
      [
        "copy-ai",
        "copy-reference",
        "duplicate",
        "delete",
        "sidebar-delete",
        "reveal-json",
        "add-work-order",
        "sidebar-hide-selection",
        "order-modify",
        "order-similar",
      ].includes(action) &&
      !selection.length &&
      (action !== "add-work-order" || !historyEntry())
    )
      button.disabled = true;
    if (action === "add-work-order") {
      button.disabled ||=
        dirty || orderBusy || !instruction.value.trim() || briefTooLong;
      button.title = dirty
        ? autoSave
          ? "Waiting for autosave before adding a work order."
          : "Save the scene before adding a work order."
        : "Select targets and describe the change. Ctrl+Enter to add.";
    }
    if (action === "copy-ai" || action === "copy-reference")
      button.disabled ||= briefTooLong;
  });
  const imageButton = $<HTMLButtonElement>(
    '[data-testid="sidebar-insert-image"]',
  );
  imageButton.disabled = blocked;
  imageButton.title =
    scene?.mode === "2d"
      ? "Choose a PNG or JPEG"
      : "Image insertion is available in 2D drawings";
  const roots = scene ? selectedRoots(scene, selection) : [];
  const hideButton = $<HTMLButtonElement>(
    '[data-testid="sidebar-hide-selection"]',
  );
  hideButton.textContent = roots.some((id) => scene!.elements[id].visible)
    ? "Hide selected"
    : "Show selected";
  orderIntent.disabled = blocked || orderBusy;
  saveSceneButton.disabled = blocked || !dirty;
  saveSceneButton.hidden = !dirty;
  orderReadiness.textContent = invalid
    ? "Repair the scene source to continue."
    : pending
      ? "Applying change…"
      : orderBusy
        ? "Saving work order…"
        : !selection.length && !historyEntry()
          ? "1. Select an image or component to use as the target."
          : briefTooLong
            ? `Shorten the brief by ${requirement.length - AGENT_BRIEF_LIMIT} characters to fit the 12,000-character limit.`
            : dirty
              ? autoSave
                ? "2. Waiting for autosave to freeze the current selection for your agent."
                : "2. Save scene to freeze the current selection for your agent."
              : !instruction.value.trim()
                ? "3. Describe the change or the new element you want."
                : "Ready: Add work order, then copy it from Orders to your agent.";
  $("#brief-length").textContent =
    `${requirement.length.toLocaleString()} / ${AGENT_BRIEF_LIMIT.toLocaleString()}`;
  briefReview.classList.toggle("over-limit", briefTooLong);
  $("#brief-preview").textContent =
    requirement ||
    "Write your idea above to review the instruction here. Selected geometry is included in the full AI handoff.";

  canvasCaption.innerHTML = `<span>${scene?.mode === "3d" ? "3D scene" : "2D drawing"}</span><small>${selection.length ? `${selection.length} selected` : "Design canvas"}</small>`;
  const targets = selection.map((id) => scene?.elements[id]).filter(Boolean);
  briefTargets.textContent = targets.length
    ? `${scene?.mode === "3d" ? "3D" : "2D"} targets: ${targets
        .slice(0, 3)
        .map((e) => e!.name)
        .join(", ")}${targets.length > 3 ? ` +${targets.length - 3} more` : ""}`
    : "Select the parts of your figure that explain your idea to the agent.";
  briefTargets.title = targets
    .map((e) => `${e!.name} (${e!.type}) · ${e!.id}`)
    .join("\n");
  const toolSelect = $<HTMLSelectElement>("#transform-tool");
  toolSelect.value = tool;
  toolSelect.disabled = blocked || !selection.length;
  const movable = scene && selection.some((id) => !isLocked(scene!, id));
  canvasTools.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
    button.disabled = blocked || !movable;
    if (button.dataset.transformTool) button.setAttribute("aria-pressed", String(button.dataset.transformTool === tool));
  });
  componentNavigator.setEnabled(!blocked && !!scene, !!selection.length);
}
function renderTree() {
  if (!scene) return;
  const elements = Object.values(scene.elements);
  $("#count").textContent = String(elements.length);
  const focusedId = (
    document.activeElement as HTMLElement
  )?.closest<HTMLElement>(".tree-row")?.dataset.elementId;
  const children = new Map<string | undefined, SceneElement[]>();
  for (const element of elements) {
    const siblings = children.get(element.parent) ?? [];
    siblings.push(element);
    children.set(element.parent, siblings);
  }
  const selected = new Set(selection);
  const query = sceneSearch.value.trim().toLocaleLowerCase();
  const matches = elements.filter(
    (e) =>
      !query ||
      `${e.name} ${e.type} ${e.id}`.toLocaleLowerCase().includes(query),
  );
  const shown = new Set(
    matches.flatMap((e) => [e.id, ...ancestors(scene!, e.id).map((a) => a.id)]),
  );
  $("#count").textContent = query
    ? `${matches.length}/${elements.length}`
    : String(elements.length);
  const rows = (parent?: string, depth = 0): string =>
    (children.get(parent) ?? [])
      .filter((e) => shown.has(e.id))
      .map((e) => {
        const hasChildren = !!children.get(e.id)?.length;
        const expanded = !!query || !collapsedGroups.has(e.id);
        const disclosure = hasChildren
          ? `<button data-collapse="${e.id}" aria-label="${expanded ? "Collapse" : "Expand"} ${esc(e.name)}" aria-expanded="${expanded}">${expanded ? "⌄" : "›"}</button>`
          : '<span class="tree-spacer" aria-hidden="true"></span>';
        return `<div class="tree-row ${selected.has(e.id) ? "selected" : ""} ${e.visible ? "" : "dim"}" data-element-id="${e.id}" role="treeitem" ${hasChildren ? `aria-expanded="${expanded}"` : ""} aria-level="${depth + 1}" tabindex="0" aria-label="${esc(e.name)} (${esc(e.type)})" aria-selected="${selected.has(e.id)}" title="${esc(e.name)} (${esc(e.type)})"><span class="indent">${"· ".repeat(Math.min(depth, 8))}</span>${disclosure}<button data-visible="${e.id}" aria-label="${e.visible ? "Hide" : "Show"} ${esc(e.name)}" title="Toggle visibility">${e.visible ? "◉" : "○"}</button><button data-locked="${e.id}" aria-label="${e.locked ? "Unlock" : "Lock"} ${esc(e.name)}" title="Toggle lock">${e.locked ? "▣" : "□"}</button><span class="element-name">${esc(e.name)}</span><small>${esc(e.type)}</small></div>${expanded ? rows(e.id, depth + 1) : ""}`;
      })
      .join("");
  tree.innerHTML =
    rows() ||
    `<p class="empty">${query ? "No matching elements. Try a name or type." : "Start by inserting an element."}</p>`;
  if (focusedId) {
    const row = [...tree.querySelectorAll<HTMLElement>(".tree-row")].find(
      (item) => item.dataset.elementId === focusedId,
    );
    row?.focus();
  }
}
tree.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const disclosure = target.closest<HTMLButtonElement>("[data-collapse]");
  if (disclosure) {
    toggleGroup(disclosure.dataset.collapse!);
    return;
  }
  const button = target.closest<HTMLButtonElement>(
    "[data-visible],[data-locked]",
  );
  if (button) {
    const id = button.dataset.visible || button.dataset.locked!;
    const element = scene?.elements[id];
    if (element)
      edit(
        id,
        button.dataset.visible
          ? { visible: !element.visible }
          : { locked: !element.locked },
      );
    return;
  }
  const row = target.closest<HTMLElement>(".tree-row");
  if (row) select(row.dataset.elementId, (event as MouseEvent).shiftKey);
});

function toggleGroup(id: string) {
  if (sceneSearch.value.trim()) return; // Search reveals matching descendants.
  if (collapsedGroups.has(id)) collapsedGroups.delete(id);
  else collapsedGroups.add(id);
  renderTree();
  saveUiState();
  [...tree.querySelectorAll<HTMLElement>(".tree-row")]
    .find((row) => row.dataset.elementId === id)
    ?.focus();
}
tree.addEventListener("keydown", (event) => {
  if (event.target !== (event.target as HTMLElement).closest(".tree-row"))
    return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    const row = event.target as HTMLElement;
    const id = row.dataset.elementId!;
    const expanded = row.getAttribute("aria-expanded");
    if (
      (event.key === "ArrowLeft" && expanded === "true") ||
      (event.key === "ArrowRight" && expanded === "false")
    ) {
      toggleGroup(id);
    } else {
      const nextId =
        event.key === "ArrowLeft"
          ? scene?.elements[id]?.parent
          : Object.values(scene?.elements ?? {}).find((e) => e.parent === id)
              ?.id;
      [...tree.querySelectorAll<HTMLElement>(".tree-row")]
        .find((item) => item.dataset.elementId === nextId)
        ?.focus();
    }
    return;
  }
  if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    const rows = [...tree.querySelectorAll<HTMLElement>(".tree-row")];
    const index = rows.indexOf(event.target as HTMLElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? rows.length - 1
          : Math.max(
              0,
              Math.min(
                rows.length - 1,
                index + (event.key === "ArrowDown" ? 1 : -1),
              ),
            );
    rows[next]?.focus();
    return;
  }
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  select((event.target as HTMLElement).dataset.elementId, event.shiftKey);
});
function field(
  label: string,
  key: string,
  value: unknown,
  type = "text",
  disabled = false,
) {
  const name =
    (
      {
        strokeWidth: "Stroke width",
        fontSize: "Font size",
        src: "Image source",
        d: "SVG path",
      } as Record<string, string>
    )[label] ?? label;
  const input = `<input data-prop="${key}" type="${type}" ${type === "number" ? 'step="any"' : ""} value="${esc(value)}" ${disabled ? "disabled" : ""}/>`;
  const color =
    (key === "fill" || key === "stroke") &&
    /^#[0-9a-f]{6}$/i.test(String(value));
  return `<label class="field"><span>${esc(name)}</span>${color ? `<span class="color-field">${input}<input data-color-prop="${key}" type="color" value="${esc(value)}" aria-label="Choose ${esc(name.toLowerCase())} color" ${disabled ? "disabled" : ""}/></span>` : input}</label>`;
}
function choiceField(label: string, key: string, value: unknown, choices: Array<[string, string]>, disabled: boolean) {
  if (key === "fontFamily") return field(label, key, value, "text", disabled);
  return `<label class="field"><span>${esc(label)}</span><select data-prop="${key}" ${disabled ? "disabled" : ""}>${choices.map(([v, name]) => `<option value="${v}" ${String(value) === v ? "selected" : ""}>${esc(name)}</option>`).join("")}</select></label>`;
}
function renderInspector() {
  if (!scene) return;
  const activeInput =
    document.activeElement instanceof HTMLInputElement &&
    inspector.contains(document.activeElement)
      ? document.activeElement
      : undefined;
  const focusedProp = activeInput?.dataset.prop;
  const previousElement = inspector.dataset.elementId;

  const es = selection.map((id) => scene!.elements[id]).filter(Boolean);
  if (es.length !== 1) {
    inspector.innerHTML = `<p class="empty">${es.length ? `${es.length} elements selected. Drag them together in 2D, or select one to edit properties.` : "Select an element on the canvas or in the scene tree."}</p>`;
    return;
  }
  const referenceOpen =
    previousElement === es[0].id &&
    inspector.querySelector<HTMLDetailsElement>(".inspector-reference")?.open;
  inspector.dataset.elementId = es[0].id;
  const e = es[0],
    locked = isLocked(scene, e.id) || invalid || pending,
    t = e.transform,
    p = e.properties,
    axes = scene.mode === "2d" ? [0, 1] : [0, 1, 2];
  const groups = Object.values(scene.elements).filter(
    (g) =>
      g.type === "group" &&
      g.id !== e.id &&
      !ancestors(scene!, g.id).some((a) => a.id === e.id),
  );
  const imageAsset = e.type === "image" ? assets[String(p.src)] : undefined;
  const preview = imageAsset
    ? `<img src="${esc(imageAsset)}" alt=""/>`
    : `<span class="selection-symbol">${icon(e.type === "group" ? "components" : "fit")}</span>`;
  inspector.innerHTML = `<div class="selection-card">${preview}<div><strong>${esc(e.name)}</strong><small>${esc(e.type)}${isLocked(scene, e.id) ? " · Locked" : ""}</small></div></div>${field("Name", "name", e.name, "text", locked)}<details class="inspector-reference" ${referenceOpen ? "open" : ""}><summary>Reference ID</summary><code class="element-id">${e.id}</code></details><h3>Position</h3>${axes.map((i) => field("XYZ"[i], `position.${i}`, t.position[i], "number", locked)).join("")}<h3>Rotation${scene.mode === "3d" ? " (radians)" : ""}</h3>${scene.mode === "2d" ? `<label class="field"><span>Angle (°)</span><input type="number" step="1" data-rotation-degrees data-testid="rotation-degrees" aria-label="Rotation angle in degrees" value="${esc(Number((t.rotation[2] * 180 / Math.PI).toFixed(3)))}" ${locked ? "disabled" : ""}/></label><div class="quick-rotation"><button type="button" data-rotate-step="-90" aria-label="Rotate selected 90 degrees counterclockwise" ${locked ? "disabled" : ""}>↶ −90°</button><button type="button" data-rotate-step="90" aria-label="Rotate selected 90 degrees clockwise" ${locked ? "disabled" : ""}>↷ +90°</button><button type="button" data-rotate-reset aria-label="Reset rotation" ${locked ? "disabled" : ""}>Reset</button></div><p class="rotation-value">${esc(((t.rotation[2] * 180) / Math.PI).toFixed(1))}°</p>` : ""}${(scene.mode === "2d" ? [2] : axes).map((i) => field("XYZ"[i], `rotation.${i}`, t.rotation[i], "number", locked)).join("")}<h3>Scale</h3>${axes.map((i) => field("XYZ"[i], `scale.${i}`, t.scale[i], "number", locked)).join("")}<h3>Appearance & geometry</h3>${Object.entries(
    p,
  )
    .filter(([k]) =>
      [
        "width",
        "height",
        "depth",
        "radius",
        "fill",
        "stroke",
        "strokeWidth",
        "opacity",
        "fontSize",
        "text",
        "d",
        "src",
        "points",
        "background",
        "strokeDasharray", "strokeDashoffset", "strokeLinecap", "strokeLinejoin",
        "fillOpacity", "strokeOpacity", "fillRule", "fontStyle", "fontFamily",
        "clipRects", "fillGradient", "strokeGradient",
      ].includes(k),
    )
    .map(([k, v]) =>
      field(
        k,
        k,
        k === "points" ? JSON.stringify(v) : v,
        typeof v === "number" ? "number" : "text",
        locked,
      ),
    )
    .join(
      "",
    )}${e.type === "text" ? `<h3>Typography</h3>${choiceField("Alignment", "textAnchor", p.textAnchor ?? "start", [["start", "Left"], ["middle", "Center"], ["end", "Right"]], locked)}${choiceField("Font", "fontFamily", p.fontFamily ?? "sans-serif", [["sans-serif", "Sans serif"], ["serif", "Serif"], ["monospace", "Monospace"]], locked)}${choiceField("Weight", "fontWeight", p.fontWeight ?? 400, [["100", "100 · Thin"], ["200", "200 · Extra light"], ["300", "300 · Light"], ["400", "400 · Regular"], ["500", "500 · Medium"], ["600", "600 · Semibold"], ["700", "700 · Bold"], ["800", "800 · Extra bold"], ["900", "900 · Black"]], locked)}` : ""}<h3>Hierarchy</h3><label class="field"><span>Parent</span><select data-prop="parent" ${locked ? "disabled" : ""}><option value="">Root</option>${groups.map((g) => `<option value="${g.id}" ${g.id === e.parent ? "selected" : ""}>${esc(g.name)} (${esc(g.id.slice(0, 8))})</option>`).join("")}</select></label><p class="hint">${scene.mode === "2d" ? "Drag the round handle to rotate; hold Shift for 15° steps. Drag square handles to resize. Degree controls preserve the visual center; raw transforms are local to the parent." : "Transforms are local to the parent. Rotations and scaling use the element origin."}</p>`;
  inspector
    .querySelectorAll<HTMLButtonElement>("[data-rotate-step]")
    .forEach((button) => {
      button.onclick = () => {
        if (renderer instanceof Renderer2D) renderer.rotateSelected(Number(button.dataset.rotateStep));
      };
    });
  if (e.type === "viewport3d") {
    const button = document.createElement("button");
    button.textContent = "Edit 3D view"; button.dataset.testid = "edit-viewport"; button.disabled = locked;
    button.onclick = () => viewportManager.edit(e.id); inspector.prepend(button);
  }
  const degrees = inspector.querySelector<HTMLInputElement>("[data-rotation-degrees]");
  if (degrees) degrees.onchange = () => {
    const value = Number(degrees.value);
    if (degrees.value.trim() && Number.isFinite(value) && renderer instanceof Renderer2D)
      renderer.rotateSelected(value, true);
    else status("Enter a finite rotation angle in degrees.", true);
  };
  const resetRotation = inspector.querySelector<HTMLButtonElement>("[data-rotate-reset]");
  if (resetRotation) resetRotation.onclick = () => {
    if (renderer instanceof Renderer2D) renderer.rotateSelected(0, true);
  };
  inspector
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-prop]")
    .forEach(
      (input) =>
        (input.onchange = () => {
          try {
            const k = input.dataset.prop!;
            if (k === "name") edit(e.id, { name: input.value });
            else if (k === "parent")
              edit(e.id, { parent: input.value || null });
            else if (k.includes(".")) {
              const [part, index] = k.split(".") as [
                "position" | "rotation" | "scale",
                string,
              ];
              const transform = structuredClone(t);
              const n = Number(input.value);
              if (!Number.isFinite(n))
                throw new Error("Enter a finite number.");
              transform[part][Number(index)] = n;
              edit(e.id, { transform });
            } else {
              const value =
                k === "fontWeight"
                  ? Number(input.value)
                  : k === "points"
                  ? JSON.parse(input.value)
                  : input instanceof HTMLInputElement && input.type === "number"
                    ? Number(input.value)
                    : input.value;
              edit(e.id, { properties: { [k]: value } });
            }
          } catch (error) {
            status(String(error), true);
            renderInspector();
          }
        }),
    );
  inspector
    .querySelectorAll<HTMLInputElement>("[data-color-prop]")
    .forEach((picker) => {
      const applyColor = () => {
        const text = inspector.querySelector<HTMLInputElement>(
          `[data-prop="${picker.dataset.colorProp}"]`,
        );
        if (!text || text.value === picker.value) return;
        text.value = picker.value;
        text.dispatchEvent(new Event("change", { bubbles: true }));
      };
      picker.oninput = applyColor;
      picker.onchange = applyColor;
    });
  if (focusedProp && previousElement === e.id) {
    const replacement = [
      ...inspector.querySelectorAll<HTMLInputElement>("[data-prop]"),
    ].find((input) => input.dataset.prop === focusedProp);
    if (replacement && !replacement.disabled)
      replacement.focus({ preventScroll: true });
  }
}
function renderPanels() {
  renderTree();
  renderInspector();
  renderControls();
}
function copy(compact: boolean) {
  if (!scene || invalid || pending || !selection.length) return;
  if (agentRequirement(instruction.value).length > AGENT_BRIEF_LIMIT) return;
  post({
    type: "copy",
    version,
    ids: selection,
    instruction: agentRequirement(instruction.value),
    compact,
  });
}
function agentRequirement(requirement: string): string {
  return composeAgentBrief({
    instruction: requirement,
    keep: briefKeep.value,
    success: briefSuccess.value,
    intent: orderIntent.value as "custom" | "modify" | "similar",
  });
}
function addWorkOrder() {
  const source = historyEntry();
  if (
    !scene ||
    invalid ||
    pending ||
    dirty ||
    orderBusy ||
    (!selection.length && !source) ||
    !instruction.value.trim() ||
    agentRequirement(instruction.value).length > AGENT_BRIEF_LIMIT
  )
    return;
  submittedRevision = briefRevision;
  orderBusy = true;
  renderControls();
  post({
    type: "workOrderAdd",
    version,
    ids: [...selection],
    requirement: agentRequirement(instruction.value),
    ...(source ? { historySequence: source.sequence } : {}),
  } as ClientMessage);
}
function insert(type: ElementType) {
  if (!scene || invalid || pending) return;
  if (type === "image") {
    post({ type: "insertImage", version });
    return;
  }
  const e = createElement(type, scene.mode);
  e.name = `${type} ${Object.keys(scene.elements).length + 1}`;
  if (renderer) {
    const bounds = canvas.getBoundingClientRect();
    e.transform.position = renderer.placementPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  }
  pendingId = e.id;
  sendOperation({ kind: "insert", element: e });
}
const insertIcons: Record<ElementType, string> = {
  viewport3d: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m12 6 6 3v6l-6 3-6-3V9zM6 9l6 3 6-3M12 12v6"/>',
  rect: '<rect x="4" y="5" width="16" height="14" rx="1"/>',
  ellipse: '<ellipse cx="12" cy="12" rx="9" ry="7"/>',
  line: '<path d="M4 19 20 5"/>',
  polyline: '<path d="M3 18 8 8 14 15 21 5"/>',
  path: '<path d="M3 17c4-15 9 12 18-10"/><circle cx="3" cy="17" r="1"/><circle cx="21" cy="7" r="1"/>',
  text: '<path d="M4 6h16M12 6v14M8 20h8"/>',
  image:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1"/><path d="m4 18 6-6 4 3 3-4 4 5"/>',
  group:
    '<rect x="3" y="5" width="11" height="11" rx="1"/><rect x="10" y="9" width="11" height="11" rx="1"/>',
  box: '<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/>',
  sphere:
    '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  cylinder:
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 19c0-1.7 3.6-3 8-3s8 1.3 8 3"/>',
  plane: '<path d="m3 15 13-11 5 5-13 11zM8 20l13-11"/>',
};
function renderInsert() {
  if (!scene) return;
  const types: ElementType[] =
    scene.mode === "2d"
      ? [
          "rect",
          "ellipse",
          "line",
          "polyline",
          "path",
          "text",
          "image",
          "viewport3d",
          "group",
        ]
      : ["box", "sphere", "cylinder", "plane", "image", "group"];
  $("#insert-buttons").innerHTML = types
    .map((type) => {
      const label = type === "viewport3d" ? "3D view" : type[0].toUpperCase() + type.slice(1);
      return `<button type="button" data-testid="insert-${type}" data-insert="${type}" title="Insert ${label}" aria-label="Insert ${label}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${insertIcons[type]}</svg></button>`;
    })
    .join("");
  document
    .querySelectorAll<HTMLElement>("[data-insert]")
    .forEach(
      (b) => (b.onclick = () => insert(b.dataset.insert as ElementType)),
    );
}
async function exportScene(eventId?: string) {
  // Inspector commits arrive through the host asynchronously. Never silently
  // drop a proof export that was requested during that short pending window.
  for(let i=0;pending&&i<1500;i++)await new Promise(resolve=>setTimeout(resolve,10));
  if (!scene || invalid || pending) {
    post({type:'exportFailed',event_id:eventId,message:'属性尚未提交或场景无效，请等待后重试'} as any);
    return;
  }
  const originVersion = version;
  try {
    if (scene.mode === "2d") {
      const viewportImages = await viewportManager.snapshots();
      if (version !== originVersion) throw new Error("Scene changed during export. Try again.");
      post({ type: "export", version: originVersion, format: "svg", data: "", viewportImages });
    }
    else if (renderer instanceof Renderer3D) {
      const buffer = await renderer.exportGlb();
      if (version !== originVersion)
        throw new Error("Scene changed during export. Try again.");
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 32768)
        binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
      post({
        type: "export",
        version: originVersion,
        format: "glb",
        data: btoa(binary),
      });
    }
  } catch (e) {
    status(String(e), true);
    post({type:'exportFailed',event_id:eventId,message:String(e)} as any);
  }
}
window.addEventListener("message", (event) => {
  const message = event.data as HostMessage;
  if (message.type === "state") {
    const changedDocument = scene?.id !== message.scene.id;
    if (changedDocument) tool = "translate";
    if (scene?.id !== message.scene.id || scene.mode !== message.scene.mode)
      cancelPlacement();
    const changedMode = scene?.mode !== message.scene.mode;
    scene = message.scene;
    document.body.dataset.documentId = scene.id;
    version = message.version;
    dirty = message.dirty;
    assets = message.assets;
    warnings = message.warnings;
    invalid = false;
    pending = false;
    clearTimeout(pendingTimer);
    selection = selection.filter((id) => !!scene!.elements[id]);
    if (pendingId && scene.elements[pendingId]) {
      selection = [pendingId];
      pendingId = undefined;
    } else if (!selection.length && saved.selection?.length && !renderer)
      selection = saved.selection.filter((id: string) => !!scene!.elements[id]);
    $("#mode").textContent = scene.mode.toUpperCase();
    $("#units").textContent =
      `${scene.units} · ${scene.mode === "2d" ? "x →, y ↓" : "right-handed · y ↑"}`;
    if (changedMode) {
      renderInsert();
      componentNavigator.setEntries(
        componentEntries,
        scene.mode,
        componentWarnings,
        componentPath,
      );
    }
    $("#warning").hidden = !dirty && !warnings.length;
    autoSave = (message as HostMessage & { autoSave?: boolean }).autoSave === true;
    $("#warning").textContent = [
      dirty
        ? autoSave
          ? "Unsaved changes — waiting for autosave before asking an agent to edit the file."
          : "Unsaved changes — save before asking an agent to edit the file."
        : "",
      ...warnings,
    ]
      .filter(Boolean)
      .join(" ");
    renderPanels();
    renderCanvas();
    if (changedDocument) renderer?.fit();
    renderHistorySource();
    status(
      `${dirty ? "Unsaved" : "Saved"} · ${Object.keys(scene.elements).length} elements · version ${version}`,
    );
    emitSelection();
  } else if (message.type === "components") {
    componentEntries = message.entries;
    componentWarnings = message.warnings;
    componentPath = message.directory;
    componentNavigator.setEntries(
      componentEntries,
      scene?.mode ?? "2d",
      componentWarnings,
      componentPath,
    );
    renderControls();
  } else if (message.type === "invalid") {
    cancelPlacement();
    invalid = true;
    pending = false;
    clearTimeout(pendingTimer);
    $("#warning").hidden = false;
    $("#warning").textContent =
      `Invalid scene source — showing last valid preview. ${message.errors.join(" ")}`;
    renderPanels();
    renderCanvas();
    status("Editing and copying disabled until the scene source is repaired.", true);
  } else if (message.type === "error") {
    if (message.message.startsWith("Autosave paused:")) {
      autoSave = false;
      $("#warning").hidden = false;
      $("#warning").textContent = message.message;
    }
    pending = false;
    orderBusy = false;
    pendingId = undefined;
    clearTimeout(pendingTimer);
    renderPanels();
    renderCanvas();
    status(message.message, true);
  } else if (message.type === "workOrders") {
    workOrders = message.orders;
    queuePath = message.queuePath;
    currentHash = message.currentHash;
    renderWorkOrders();
    decorateOrderCards();
    renderHistory();
  } else if (message.type === "sceneHistory") {
    sceneHistory = message.entries;
    historyLoaded = true;
    queuePath = message.journalPath;
    renderWorkOrders();
    decorateOrderCards();
    renderHistory();
  } else if (message.type === "workOrderAdded") {
    orderBusy = false;
    const draftUnchanged = briefRevision === submittedRevision;
    if (draftUnchanged) {
      instruction.value = "";
      briefKeep.value = "";
      briefSuccess.value = "";
      historySequence = undefined;
      briefRevision++;
      emitSelection();
      renderHistorySource();
    }
    submittedRevision = undefined;
    if (draftUnchanged) showPanel("orders");
    renderControls();
    status(
      `Work order ${message.id} saved${draftUnchanged ? "" : " · Your new draft is kept"}`,
    );
  } else if (message.type === "workOrderSelected") {
    selection = message.ids.filter((id) => !!scene?.elements[id]);
    showPanel("inspector");
    renderPanels();
    renderCanvas();
    emitSelection();
  } else if (message.type === "elementPasted") {
    selection = message.ids;
    if (orderBusy) briefRevision++;
    showPanel("inspector");
    renderPanels();
    renderCanvas();
    emitSelection();
    status(autoSave ? "Pasted elements. Autosave and History update automatically." : "Pasted elements recorded in History. Save scene to persist them.");
  } else if (message.type === "copied") status(message.message);
  else if (message.type === "exportRequest") void exportScene((message as any).event_id);
});
for (const input of [instruction, briefKeep, briefSuccess]) {
  input.addEventListener("input", () => {
    briefRevision++;
    emitSelection();
    renderControls();
  });
  input.addEventListener("keydown", (event) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter" &&
      !event.isComposing
    ) {
      event.preventDefault();
      addWorkOrder();
    }
  });
}
addWorkOrderButton.onclick = addWorkOrder;
saveSceneButton.onclick = () => {
  if (!scene || invalid || pending || !dirty) return;
  pending = true;
  renderControls();
  post({ type: "saveScene", version });
  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => {
    pending = false;
    renderControls();
    post({ type: "ready" });
  }, 5000);
};

orderIntent.onchange = () => {
  briefRevision++;
  emitSelection();
  renderControls();
};
$('[data-testid="sidebar-insert-image"]').onclick = () => insert("image");
$('[data-testid="sidebar-hide-selection"]').onclick = () => {
  if (!scene || invalid || pending || !selection.length) return;
  const roots = selectedRoots(scene, selection);
  const visible = !roots.some((id) => scene!.elements[id].visible);
  sendOperation({
    kind: "update",
    updates: roots.map((id) => ({ id, changes: { visible } })),
  });
};
for (const intent of ["modify", "similar"] as const) {
  $(`[data-testid="order-${intent}"]`).onclick = () => {
    orderIntent.value = intent;
    briefRevision++;
    showPanel("inspector");
    instruction.placeholder =
      intent === "similar"
        ? "Describe the new image or component to create from this reference…"
        : "Describe what the agent should change…";
    setBriefOpen(true);
    instruction.focus();
    emitSelection();
    renderControls();
    status(
      "Describe the requirement, save the scene, then Add work order. Use Orders to copy it for your agent.",
    );
  };
}

tabBar.addEventListener("click", (event) => {
  const panel = (event.target as HTMLElement).closest<HTMLElement>(
    "[data-panel]",
  )?.dataset.panel;
  if (
    panel === "inspector" ||
    panel === "components" ||
    panel === "orders" ||
    panel === "history"
  )
    showPanel(panel);
});
tabBar.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const buttons = [...tabBar.querySelectorAll<HTMLButtonElement>("[data-panel]")];
  const current = buttons.indexOf(event.target as HTMLButtonElement);
  if (current < 0) return;
  event.preventDefault();
  event.stopPropagation();
  const index = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
  const button = buttons[index];
  button.click();
  button.focus({ preventScroll: true });
});
historyActivity.onclick = () => {
  showPanel("history");
  historyPanel
    .querySelector<HTMLDetailsElement>(".history-card")
    ?.setAttribute("open", "");
};
historyPanel.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const useButton = target.closest<HTMLButtonElement>('[data-history-action="order"]');
  if (useButton?.dataset.historySequence) {
    const sequence = Number(useButton.dataset.historySequence);
    const entry = sceneHistory.find((item) => item.sequence === sequence);
    if (!entry) return;
    historySequence = sequence;
    const reference = `Based on history #${entry.sequence} · ${entry.action}`;
    const existing = instruction.value.trim();
    instruction.value = existing
      ? `${existing}\n\n${reference}`
      : entry.action;
    selection = Object.keys(entry.elements).filter((id) => !!scene?.elements[id]);
    briefRevision++;
    renderHistorySource();
    showPanel("inspector");
    setBriefOpen(true);
    renderPanels();
    renderCanvas();
    emitSelection();
    status(`${reference} · review the brief before adding the work order.`);
    return;
  }
  const removeSource = target.closest<HTMLButtonElement>('[data-history-source-action="remove"]');
  if (removeSource) {
    historySequence = undefined;
    renderHistorySource();
    renderControls();
    saveUiState();
    status("History source removed; your draft is kept.");
    return;
  }
  const action = target.closest<HTMLButtonElement>(
    "[data-history-action]",
  )?.dataset.historyAction;
  if (action === "refresh") post({ type: "historyRefresh" });
  else if (action === "copy") post({ type: "historyCopy" });
  else if (action === "more") {
    historyVisibleCount += 50;
    renderHistory();
  }
});
historySource.addEventListener("click", (event) => {
  if (!(event.target as HTMLElement).closest<HTMLButtonElement>('[data-history-source-action="remove"]')) return;
  historySequence = undefined;
  briefRevision++;
  renderHistorySource();
  renderControls();
  emitSelection();
  saveUiState();
  status("History source removed; your draft is kept.");
});
ordersPanel.addEventListener("click", (event) => {
  const action = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-order-action]",
  );
  if (!action || action.disabled) return;
  if (action.dataset.orderAction === "refresh")
    post({ type: "workOrderRefresh" });
  else if (action.dataset.orderAction === "copy-open")
    post({ type: "workOrderCopy" });
  else if (action.dataset.orderAction === "copy")
    post({ type: "workOrderCopy", id: action.dataset.orderId });
  else if (action.dataset.orderAction === "highlight" && action.dataset.orderId)
    post({ type: "workOrderHighlight", id: action.dataset.orderId });
});
themeSelect.addEventListener("change", () => {
  theme = themeSelect.value as typeof theme;
  for (const [testId, iconName] of Object.entries({
    "fit-scene": "fit",
    duplicate: "duplicate",
    delete: "delete",
    "reveal-json": "code",
    export: "export",
  })) {
    const button = document.querySelector<HTMLButtonElement>(
      `[data-testid="${testId}"]`,
    )!;
    const label = button.textContent ?? "";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `${icon(iconName)}<span class="button-label">${label}</span>`;
  }
  document.body.dataset.theme = theme;
  if (renderer instanceof Renderer3D) renderer.setTheme();
  saveUiState();
});
new MutationObserver(() => {
  if (theme === "vscode" && renderer instanceof Renderer3D) renderer.setTheme();
}).observe(document.body, { attributes: true, attributeFilter: ["class"] });
$('[data-testid="fit-scene"]').onclick = () => renderer?.fit();
$('[data-testid="duplicate"]').onclick = () => {
  if (selection.length) sendOperation({ kind: "duplicate", ids: selection });
};
$('[data-testid="delete"]').onclick = () => {
  if (selection.length) sendOperation({ kind: "delete", ids: selection });
};
$('[data-testid="copy-reference"]').onclick = () => copy(true);
$('[data-testid="copy-ai"]').onclick = () => copy(false);
$('[data-testid="reveal-json"]').onclick = () => {
  if (selection[0]) post({ type: "reveal", id: selection[0] });
};
$('[data-testid="export"]').onclick = () => void exportScene();
function chooseTool(next: typeof tool) {
  tool = next;
  renderer?.setTool(tool);
  rendererTool = tool;
  renderControls();
  canvas.focus({ preventScroll: true });
  status(tool === "rotate" ? "Drag the round handle to rotate. Hold Shift for 15° steps." : tool === "scale" ? "Drag a square handle to resize. Image corners preserve proportions; Shift constrains shapes." : "Drag to move. Hold Shift to keep movement horizontal or vertical.");
}
$("#transform-tool").onchange = () => {
  chooseTool($<HTMLSelectElement>("#transform-tool").value as typeof tool);
};
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (placement || componentNavigator.isOpen())) {
    cancelPlacement();
    componentNavigator.setOpen(false);
    componentsButton.setAttribute("aria-expanded", "false");
    status("Component placement closed.");
    return;
  }
  const target = event.target as HTMLElement;
  if (target.closest('input,textarea,select,[contenteditable="true"]')) return;
  if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && scene && !invalid && !pending && selection.length) {
    const shortcut = ({ v: "translate", r: "rotate", s: "scale" } as const)[event.key.toLowerCase() as "v" | "r" | "s"];
    if (shortcut) { event.preventDefault(); chooseTool(shortcut); return; }
  }
  if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey) {
    const key = event.key.toLowerCase();
    if (key === "c") {
      if (window.getSelection()?.toString()) return;
      event.preventDefault();
      if (scene && !invalid && !pending && selection.length)
        post({ type: "elementCopy", version, ids: [...selection] });
      return;
    }
    if (key === "v") {
      event.preventDefault();
      if (!scene || invalid || pending) return;
      pending = true;
      renderControls();
      post({ type: "elementPaste", version });
      clearTimeout(pendingTimer);
      pendingTimer = setTimeout(() => {
        pending = false;
        renderControls();
        post({ type: "ready" });
      }, 5000);
      return;
    }
  }
  if (
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "a"
  ) {
    event.preventDefault();
    if (!scene || invalid || pending || !selection.length) return;
    const focusTree = !!target.closest("#tree");
    const parents = selectedRoots(scene, [
      ...new Set(selection.map((id) => scene!.elements[id]?.parent ?? id)),
    ]);
    if (
      parents.length === selection.length &&
      parents.every((id) => selection.includes(id))
    ) {
      status("Already at the top-level component.");
      return;
    }
    selection = parents;
    if (orderBusy) briefRevision++;
    selection.forEach((id) =>
      ancestors(scene!, id).forEach((parent) =>
        collapsedGroups.delete(parent.id),
      ),
    );
    showPanel("inspector");
    renderPanels();
    let row = [...tree.querySelectorAll<HTMLElement>(".tree-row")].find(
      (item) => item.dataset.elementId === selection[0],
    );
    if (!row && sceneSearch.value) {
      sceneSearch.value = "";
      renderTree();
      row = [...tree.querySelectorAll<HTMLElement>(".tree-row")].find(
        (item) => item.dataset.elementId === selection[0],
      );
    }
    row?.scrollIntoView({ block: "nearest" });
    if (focusTree) row?.focus({ preventScroll: true });
    renderCanvas();
    emitSelection();
    status(
      `Parent component selected: ${selection.map((id) => scene!.elements[id].name).join(", ")} · Ctrl+A to move up again`,
    );
    return;
  }

  if (
    target === canvas &&
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
  ) {
    event.preventDefault();
    if (!scene || invalid || pending || !selection.length) return;
    const step = (scene.mode === "2d" ? 1 : 0.1) * (event.shiftKey ? 10 : 1);
    const axis =
      event.key === "ArrowLeft" || event.key === "ArrowRight" ? 0 : 1;
    const direction =
      axis === 0
        ? event.key === "ArrowLeft"
          ? -1
          : 1
        : (event.key === "ArrowUp" ? -1 : 1) * (scene.mode === "2d" ? 1 : -1);
    const updates = selectedRoots(scene, selection)
      .filter((id) => !isLocked(scene!, id))
      .map((id) => {
        const transform = structuredClone(scene!.elements[id].transform);
        transform.position[axis] += step * direction;
        return { id, changes: { transform } };
      });
    if (updates.length) sendOperation({ kind: "update", updates });
    return;
  }
  if (["Delete", "Backspace"].includes(event.key) && selection.length) {
    event.preventDefault();
    sendOperation({ kind: "delete", ids: selection });
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
    event.preventDefault();
    if (selection.length) sendOperation({ kind: "duplicate", ids: selection });
  }
  if (
    (event.ctrlKey || event.metaKey) &&
    event.shiftKey &&
    event.key.toLowerCase() === "c"
  ) {
    event.preventDefault();
    copy(false);
  }
  if (event.key === "Escape") {
    selection = [];
    renderPanels();
    renderCanvas();
    emitSelection();
  }
});
window.addEventListener("beforeunload", () => {
  renderer?.dispose();
  clearTimeout(pendingTimer);
});
renderControls();
showPanel(activePanel);
renderWorkOrders();
renderHistory();
post({ type: "ready" });
