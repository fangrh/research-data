// ResearchData host bridge for the unmodified Three Interact editor.
// The scene model, renderer, inspector and component library are upstream code.
import { applyOperation, createElement, createScene, validateScene, isLocked, type Scene, type Operation, type ClientMessage } from '@three/model';
import { builtInComponents, parseComponent } from '@three/components';
import { createElementClipboard, pasteElementClipboard } from '@three/elementClipboard';
import { serializeSvg } from '@three/export2d';

let scene: Scene = createScene('2d'), assets: Record<string,string> = {}, version = 0;
let history: any[] = [], orders: any[] = [], selection: string[] = [], ui: any = {}, identity = '';
let parentHash = '', dirty = false, resetToken: any = null, seeding = false, readyResolve: () => void;
const ready = new Promise<void>(resolve => readyResolve = resolve);
const undoStack: Scene[] = [], redoStack: Scene[] = [];
let clipboard = '', exportAction = '', queue = Promise.resolve(), debounce: ReturnType<typeof setTimeout>;
const source = () => JSON.stringify(scene, null, 2);
const sha = async (s: string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(n=>n.toString(16).padStart(2,'0')).join('');
const send = (m:any) => window.postMessage(m,location.origin);
const streamlit = (type: string, data: any = {}) => parent.postMessage({isStreamlitMessage:true,type,...data},'*');
const uri = () => `research-data://${identity}/${scene.id}`;
function notice(text: string) { const label=document.querySelector('[data-proof-status]'); if(label) label.textContent=text; }
function enqueue(action:()=>Promise<void>) { queue=queue.then(action).catch(e=>{send({type:'error',message:String(e.message||e)}); notice(String(e.message||e));}); }
async function refresh() {
  send({type:'state',scene,version,dirty,autoSave:true,assets,warnings:[]});
  if(selection.length)send({type:'workOrderSelected',ids:selection.filter(id=>scene.elements[id])});
  send({type:'sceneHistory',entries:history,journalPath:uri()});
  send({type:'workOrders',orders,queuePath:uri(),currentHash:await sha(source())});
}
function emit(action:string, extra:any={}) {
  streamlit('streamlit:setComponentValue',{value:{event_id:crypto.randomUUID(),action,scene:structuredClone(scene),assets:structuredClone(assets),
    base_hash:parentHash,editor:{history,orders,selection,version,components:customComponents},...extra},dataType:'json'});
  notice(action==='autosave'?'编辑已同步到本地草稿':'正在保存到本地资料库…');
}
function autosave() { clearTimeout(debounce); debounce=setTimeout(()=>emit('autosave'),650); }
async function change(next:Scene, action:string, origin='viewer', undo=true) {
  validateScene(next); if(JSON.stringify(next)===JSON.stringify(scene))return;const before=structuredClone(scene);
  if(undo){undoStack.push(before);redoStack.length=0;}
  const elements:any={}; for(const id of new Set([...Object.keys(before.elements),...Object.keys(next.elements)])){
    if(JSON.stringify(before.elements[id])!==JSON.stringify(next.elements[id])) elements[id]={...(before.elements[id]?{before:before.elements[id]}:{}),...(next.elements[id]?{after:next.elements[id]}:{})};
  }
  const metadata=(s:Scene)=>({id:s.id,mode:s.mode,units:s.units,coordinates:s.coordinates});
  history.push({sequence:(history.at(-1)?.sequence||0)+1,at:new Date().toISOString(),sceneUri:uri(),source:origin,action,
    beforeTextHash:await sha(source()),afterTextHash:await sha(JSON.stringify(next,null,2)),beforeMetadata:metadata(before),afterMetadata:metadata(next),elements});
  history=history.slice(-100);scene=next;version++;dirty=true;await refresh();autosave();
}
async function edit(op:Operation) { await change(applyOperation(scene,op),op.kind); }
async function undo() { const next=undoStack.pop();if(!next)return;redoStack.push(structuredClone(scene));await change(next,'Undo','undo',false); }
async function redo() { const next=redoStack.pop();if(!next)return;undoStack.push(structuredClone(scene));await change(next,'Redo','redo',false); }
function dialog(text:string) {
  let panel=document.querySelector<HTMLElement>('.proof-source'); if(!panel){panel=document.createElement('section');panel.className='proof-source';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','源文件和 Agent 引用');panel.innerHTML='<button>关闭</button><textarea aria-label="源文件和 Agent 引用" readonly></textarea>';document.body.append(panel);panel.querySelector('button')!.onclick=()=>panel!.hidden=true;}
  panel.hidden=false;const input=panel.querySelector('textarea')!;input.value=text;input.focus();input.select();
}
async function copy(text:string) {try{await navigator.clipboard.writeText(text);send({type:'copied',message:'已复制'});}catch{dialog(text);}}
function download(name:string,content:string,type='application/json'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function choose(accept:string,fn:(file:File)=>Promise<void>){const input=document.createElement('input');input.type='file';input.accept=accept;input.onchange=()=>input.files?.[0]&&enqueue(()=>fn(input.files![0]));input.click();}
async function imageData(file:File){if(!['image/png','image/jpeg'].includes(file.type)||file.size>32*1024*1024)throw Error('请选择不超过32MB的PNG/JPEG图片');
  const data=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=reject;r.readAsDataURL(file);});
  const img=new Image();img.src=data;await img.decode();if(img.naturalWidth*img.naturalHeight>16*1024*1024)throw Error('图片像素过多');return {data,width:img.naturalWidth,height:img.naturalHeight};}
async function png(svg:string){const img=new Image();const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{img.src=url;await img.decode();const canvas=document.createElement('canvas');const scale=Math.min(2,2400/Math.max(img.naturalWidth,img.naturalHeight));canvas.width=Math.max(1,Math.ceil(img.naturalWidth*scale));canvas.height=Math.max(1,Math.ceil(img.naturalHeight*scale));const ctx=canvas.getContext('2d')!;ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/png');}finally{URL.revokeObjectURL(url);}}
function requestExport(action:string){if(exportAction){notice('正在导出，请稍候');return;}clearTimeout(debounce);exportAction=action;send({type:'exportRequest'});}
async function seedPlot(figure:any){if(seeding||Object.keys(scene.elements).length)return;seeding=true;const plot=document.createElement('div');plot.style.cssText='position:fixed;left:-20000px;top:0;width:1000px;height:620px';document.body.append(plot);
  try{const Plotly=(window as any).Plotly;await Plotly.newPlot(plot,figure.data,{...figure.layout,width:1000,height:620},{staticPlot:true});const data=await Plotly.toImage(plot,{format:'png',width:1000,height:620,scale:1.5});
    const element=createElement('image','2d');element.name='Data plot · panel a';element.properties={src:'data-plot.png',width:800,height:496,opacity:1};assets['data-plot.png']=data;await edit({kind:'insert',element});send({type:'workOrderSelected',ids:[element.id]});
  }finally{(window as any).Plotly?.purge(plot);plot.remove();seeding=false;}}
function menu(){if(document.querySelector('.proof-menu'))return;const bar=document.createElement('nav');bar.className='proof-menu';bar.dataset.hostControls='';bar.innerHTML='<strong>Three Interact</strong><button data-action="undo">撤销</button><button data-action="redo">重做</button><button data-action="front">置于顶层</button><button data-action="open">导入场景 / 组件</button><button data-action="source">场景 JSON</button><button data-action="save">保存编辑</button><button data-action="publish" class="primary">保存并生成校样</button><small data-proof-status>拖动图形，或在左侧添加组件</small>';document.body.prepend(bar);
  bar.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(b=>b.onclick=()=>enqueue(async()=>{const a=b.dataset.action;
    if(a==='undo')await undo();if(a==='redo')await redo();if(a==='source')dialog(source());if(a==='save'||a==='publish')requestExport(a);
    if(a==='front'){const next=structuredClone(scene);next.elements=Object.fromEntries([...Object.entries(next.elements).filter(([id])=>!selection.includes(id)),...Object.entries(next.elements).filter(([id])=>selection.includes(id))]);await change(next,'Bring to front');}
    if(a==='open')choose('.json',async file=>{const obj=JSON.parse(await file.text());if(obj.schema==='three-interact.component'){const c=parseComponent(JSON.stringify(obj));customComponents.push(c);components();autosave();return;}const next=obj.scene||obj;validateScene(next);if(next.mode!=='2d')throw Error('期刊图请使用2D场景，可添加3D视窗');assets={...assets,...(obj.assets||{})};await change(next,'Import scene');});
  }));
}
let customComponents:any[]=[];
function components(){send({type:'components',entries:[...builtInComponents(),...customComponents],warnings:[],directory:'ResearchData · 内置 / 当前草稿'});}
async function handle(m:ClientMessage){
  if('version'in m&&m.version!==version)throw Error('场景版本已变化，请重试');
  if(m.type==='ready'){menu();components();await refresh();return;}
  if(m.type==='selection'){selection=m.ids;return;}
  if(m.type==='edit'){await edit(m.operation);return;}
  if(m.type==='insertImage'){const v=version;choose('image/png,image/jpeg',async file=>{const image=await imageData(file);if(v!==version)throw Error('选择图片时场景发生变化，请重试');
    const viewport=m.viewportId?scene.elements[m.viewportId]:undefined;if(m.viewportId&&(!viewport||isLocked(scene,viewport.id)))throw Error('视窗不存在或已锁定');
    const element=createElement('image',viewport?'3d':'2d');const name=`image-${element.id}.png`;assets[name]=image.data;element.name=file.name;element.properties.src=name;
    const width=viewport?2:320;element.properties.width=width;element.properties.height=width*image.height/image.width;
    if(viewport){const embedded=applyOperation(viewport.properties.scene!,{kind:'insert',element});await edit({kind:'update',updates:[{id:viewport.id,changes:{properties:{...viewport.properties,scene:embedded}}}]});}
    else await edit({kind:'insert',element});send({type:'workOrderSelected',ids:[viewport?.id||element.id]});});return;}
  if(m.type==='saveScene'){requestExport('save');return;}
  if(m.type==='reveal'){dialog(source());return;}
  if(m.type==='export'){
    if(m.format!=='svg')throw Error('校样使用2D画布；3D内容可添加为视窗');const svg=serializeSvg(scene,assets,m.viewportImages);
    const action=exportAction;const exportVersion=version;const exportScene=scene;
    if(action){try{const figure_png=await png(svg);if(version!==exportVersion||scene!==exportScene)throw Error('导出期间场景发生变化，请再次保存');emit(action,{figure_png,figure_svg:svg,editor:{history,orders,selection,version,components:customComponents}});dirty=false;}finally{exportAction='';}}
    else download('figure.svg',svg,'image/svg+xml');return;
  }
  const handoff=async()=>({schema:'research-data.figure-selection.v1',uri:uri(),scene_id:scene.id,scene_sha256:await sha(source()),version,selected_ids:'ids'in m?m.ids:selection,scene, instruction:'instruction'in m?m.instruction:'',draft_only:true});
  if(m.type==='copy'){await copy(JSON.stringify(await handoff(),null,2));return;}
  if(m.type==='elementCopy'){clipboard=createElementClipboard(scene,uri(),m.ids);await copy(clipboard);return;}
  if(m.type==='elementPaste'){let text=clipboard;try{text=await navigator.clipboard.readText()||text;}catch{}const pasted=pasteElementClipboard(text,scene,uri());await edit({kind:'insertMany',elements:pasted.elements});send({type:'elementPasted',ids:pasted.rootIds});return;}
  if(m.type==='componentsRefresh'){components();return;}
  if(m.type==='componentSave'){const ids=new Set(m.ids);let changed=true;while(changed){changed=false;for(const e of Object.values(scene.elements))if(e.parent&&ids.has(e.parent)&&!ids.has(e.id)){ids.add(e.id);changed=true;}}const elements:any={};for(const id of ids){const e=structuredClone(scene.elements[id]);if(!e)continue;if(e.parent&&!ids.has(e.parent))delete e.parent;elements[id]=e;}
    const entry=parseComponent(JSON.stringify({schema:'three-interact.component',version:1,name:scene.elements[m.ids[0]]?.name||'Custom',id:`custom-${crypto.randomUUID()}`,category:'Local',mode:scene.mode,elements}));customComponents.push({...entry,source:'当前草稿'});components();emit('autosave',{editor:{history,orders,selection,version,components:customComponents}});return;}
  if(m.type==='componentGuideCopy'){await copy('Create a three-interact.component v1 inert JSON definition with stable element UUIDs; import it into ResearchData. Retain original scientific source and avoid executing scene source.');return;}
  if(m.type==='workOrderAdd'){const at=new Date().toISOString();const context=await handoff();const order={id:crypto.randomUUID(),sequence:orders.length+1,sceneUri:uri(),sceneId:scene.id,snapshotHash:context.scene_sha256,selectedIds:m.ids,requirement:m.requirement,context:{...context,history:m.historySequence?history.find(h=>h.sequence===m.historySequence):null},status:'open',createdAt:at,history:[{event:'created',at,status:'open'}]};orders.push(order);send({type:'workOrderAdded',id:order.id,requirement:order.requirement});await refresh();emit('autosave');return;}
  if(m.type==='historyRefresh'||m.type==='workOrderRefresh'){await refresh();return;}
  if(m.type==='historyCopy'){await copy(JSON.stringify(history,null,2));return;}
  if(m.type==='workOrderCopy'){await copy(JSON.stringify(m.id?orders.filter(o=>o.id===m.id):orders,null,2));return;}
  if(m.type==='workOrderHighlight'){const order=orders.find(o=>o.id===m.id);if(order)send({type:'workOrderSelected',ids:order.selectedIds.filter((id:string)=>scene.elements[id])});}
}
(window as any).acquireVsCodeApi=()=>({postMessage:(m:ClientMessage)=>enqueue(async()=>{await ready;await handle(m);}),getState:()=>ui,setState:(s:any)=>ui=s});
window.addEventListener('message',event=>{if(event.source!==parent||event.data?.type!=='streamlit:render')return;
  const args=event.data.args, payload=args.payload;
  try{if(!payload?.scene)return;validateScene(payload.scene);const nextIdentity=String(args.identity);
    if(identity!==nextIdentity||args.reset_token!==resetToken){scene=structuredClone(payload.scene);assets={...(payload.assets||{})};history=payload.editor?.history||[];orders=payload.editor?.orders||[];selection=payload.editor?.selection||[];customComponents=payload.editor?.components||[];version=payload.editor?.version||0;undoStack.length=0;redoStack.length=0;identity=nextIdentity;resetToken=args.reset_token;dirty=false;}
    parentHash=String(args.draft_hash||'');if(payload.editor?.version===version)dirty=false;readyResolve();
    enqueue(async()=>{components();await refresh();notice(args.saved_notice||'已连接本地草稿 · 编辑自动保存');streamlit('streamlit:setFrameHeight',{height:760});if(payload.editor?.seed_plotly)await seedPlot(payload.editor.seed_plotly);});
  }catch(error){notice(String(error));}
});
document.addEventListener('keydown',event=>{if(!(event.ctrlKey||event.metaKey))return;if(event.key.toLowerCase()==='s'){event.preventDefault();requestExport('save');}else if(! (event.target as HTMLElement).closest('input,textarea,select')&&['z','y'].includes(event.key.toLowerCase())){event.preventDefault();event.stopImmediatePropagation();enqueue(()=>event.key.toLowerCase()==='y'||event.shiftKey?redo():undo());}},true);
// Commit inspector changes after typing, including hosts whose clicks do not blur inputs.
// The upstream inspector remains the authority for validation and edit operations.
const propertyTimers=new WeakMap<HTMLInputElement,ReturnType<typeof setTimeout>>();
document.addEventListener('input',event=>{const input=event.target as HTMLInputElement;if(!input.matches?.('input[data-prop]')||input.type==='color')return;clearTimeout(propertyTimers.get(input));propertyTimers.set(input,setTimeout(()=>{if(input.isConnected&&input.value.trim()&&(input.type!=='number'||Number.isFinite(Number(input.value))))input.dispatchEvent(new Event('change',{bubbles:true}));},220));});
streamlit('streamlit:componentReady',{apiVersion:1});
