// Convert the rendered Plotly SVG into native scene primitives, never a plot bitmap.
import {createElement, validateScene, type Scene, type SceneElement} from '@three/model';
const MAX_ELEMENTS=10000;
const number=(node:Element,key:string,fallback=0)=>Number(node.getAttribute(key)??fallback);
const matrix=(node:SVGElement)=>{const list=(node as SVGGraphicsElement).transform?.baseVal;const m=list?.consolidate()?.matrix;return m?new DOMMatrix([m.a,m.b,m.c,m.d,m.e,m.f]):new DOMMatrix();};
function transform(m:DOMMatrix):SceneElement['transform'] {
  const sx=Math.hypot(m.a,m.b), sy=(m.a*m.d-m.b*m.c)/(sx||1);
  if(sx<=0||sy<=0||Math.abs(m.a*m.c+m.b*m.d)>1e-6*Math.max(1,sx*sy))throw Error('绘图含无法无损表示的倾斜或镜像变换，请调整绘图配方');
  return {position:[m.e,m.f,0],rotation:[0,0,Math.atan2(m.b,m.a)],scale:[sx,sy,1]};
}
function paint(node:SVGElement, plot:HTMLElement) {
  const css=getComputedStyle(node),value=(key:string)=>node.style.getPropertyValue(key)||css.getPropertyValue(key),p:any={fill:value('fill')||'none',stroke:value('stroke')||'none',strokeWidth:parseFloat(value('stroke-width'))||0,
    opacity:Number(value('opacity')||1),fillOpacity:Number(value('fill-opacity')||1),strokeOpacity:Number(value('stroke-opacity')||1),
    strokeLinecap:css.strokeLinecap||'butt',strokeLinejoin:css.strokeLinejoin||'miter',fillRule:css.fillRule||'nonzero'};
  if(css.strokeDasharray&&css.strokeDasharray!=='none')p.strokeDasharray=css.strokeDasharray.split(/[ ,]+/).map(parseFloat);
  if(parseFloat(css.strokeDashoffset))p.strokeDashoffset=parseFloat(css.strokeDashoffset);
  for(const kind of ['fill','stroke'])if(p[kind].startsWith('url(')){
    const id=p[kind].match(/#([^\)"']+)/)?.[1], def=id?[...plot.querySelectorAll('linearGradient')].find(e=>e.id===id):null;
    if(!def)throw Error('绘图使用了不支持的渐变或外部图案');
    const value=(key:string,fallback:number)=>{const s=def.getAttribute(key);return s?.endsWith('%')?parseFloat(s)/100:Number(s??fallback);};
    const gm=(def as SVGLinearGradientElement).gradientTransform.baseVal.consolidate()?.matrix;
    p[kind+'Gradient']={type:'linear',units:def.getAttribute('gradientUnits')||'objectBoundingBox',x1:value('x1',0),y1:value('y1',0),x2:value('x2',1),y2:value('y2',0),
      ...(gm?{transform:[gm.a,gm.b,gm.c,gm.d,gm.e,gm.f]}:{}),stops:[...def.querySelectorAll('stop')].map(s=>({offset:valueStop(s),color:getComputedStyle(s).stopColor,opacity:Number(getComputedStyle(s).stopOpacity||1)}))};p[kind]='none';
  }
  const clip=node.getAttribute('clip-path')||css.clipPath;
  if(clip&&clip!=='none'){
    const id=clip.match(/#([^\)"']+)/)?.[1],def=[...plot.querySelectorAll('clipPath')].find(e=>e.id===id);
    if(!def||def.children.length!==1||def.firstElementChild?.tagName.toLowerCase()!=='rect')throw Error('绘图使用了不支持的裁剪形状');
    const rect=def.firstElementChild as SVGElement,m=matrix(rect);
    p.clipRects=[{x:number(rect,'x'),y:number(rect,'y'),width:number(rect,'width'),height:number(rect,'height'),matrix:[m.a,m.b,m.c,m.d,m.e,m.f]}];
  }
  return p;
}
function valueStop(node:Element){const value=node.getAttribute('offset')||'0';return parseFloat(value)/(value.endsWith('%')?100:1);}
function role(node:Element) {
  const classes=[node,...parents(node)].map(e=>e.getAttribute('class')||'').join(' ');
  if(/\bpoints\b/.test(classes))return 'marker';if(/\blines\b|js-line/.test(classes))return 'curve';
  if(/legend/.test(classes))return 'legend';if(/colorbar|cb[a-z\d]+/.test(classes))return 'colorbar';
  if(/tick/.test(classes))return 'axis-tick';if(/title/.test(classes))return 'title';
  if(/grid|zero|axis|xy/.test(classes))return 'axis';if(/annotation/.test(classes))return 'annotation';return node.tagName.toLowerCase();
}
function parents(node:Element){const out:Element[]=[];let p=node.parentElement;while(p&&p.tagName.toLowerCase()!=='svg'){out.push(p);p=p.parentElement;}return out;}
function semantic(node:Element,gd:any){const traceNode=node.closest('.trace'),bound=(traceNode as any)?.__data__;
  const trace=Array.isArray(bound)?bound[0]?.trace:bound?.trace, index=trace?gd._fullData.indexOf(trace):-1;
  const point=(node as any).__data__,pointIndex=point?.i;
  return {role:role(node),...(node.matches('.cbbg')?{svg_style:node.getAttribute('style')}:{}),...(index>=0?{trace_index:index,trace_name:trace.name,xaxis:trace.xaxis,yaxis:trace.yaxis}:{}),...(pointIndex!==undefined?{point_index:pointIndex,x:point.x,y:point.y}: {})};
}
const palettes=new WeakMap<object,number[][]>();
function rgba(color:string){const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d',{willReadFrequently:true})!;ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].map((v,i)=>i===3?v/255:v);}
function heatColor(trace:any,z:number){let t=(z-trace.zmin)/(trace.zmax-trace.zmin||1);t=Math.max(0,Math.min(1,t));if(trace.reversescale)t=1-t;
  const stops=trace.colorscale;if(!palettes.has(trace))palettes.set(trace,stops.map((s:any)=>rgba(s[1])));const colors=palettes.get(trace)!;
  let hi=stops.findIndex((s:any)=>s[0]>=t);if(hi<0)hi=stops.length-1;const lo=Math.max(0,hi-1),a=stops[lo],b=stops[hi],f=(t-a[0])/(b[0]-a[0]||1),ca=colors[lo],cb=colors[hi];
  const v=ca.map((n,i)=>i<3?Math.round(n+(cb[i]-n)*f):n+(cb[i]-n)*f);return `rgba(${v.join(',')})`;
}
export async function importPlot(figure:any,base:Scene,request:any={}) {
  const sourceFigure=structuredClone(figure),renderFigure=structuredClone(figure);
  const plot=document.createElement('div');plot.style.cssText='position:fixed;left:-20000px;top:0;width:1000px;height:620px';document.body.append(plot);
  const Plotly=(window as any).Plotly;
  try {
    await document.fonts.ready;
    await Plotly.newPlot(plot,renderFigure.data,{...renderFigure.layout,width:1000,height:620},{staticPlot:true,displayModeBar:false});
    await document.fonts.ready;
    const gd=plot as any,next=structuredClone(base),elements:SceneElement[]=[],counts:Record<string,number>={};
    const old=request.replace_element_id?next.elements[request.replace_element_id]:undefined;
    if(request.replace_element_id&&(!old||old.type!=='image'))throw Error('需要升级的图片元素已经变化，请重新选择');
    const root=createElement('group','2d');root.name='可编辑数据图';root.properties={plotSource:{role:'plot',source_id:request.token||crypto.randomUUID()}};
    // New imports occupy the same 800px panel as the previous image bridge.
    root.transform={position:[-400,-248,0],rotation:[0,0,0],scale:[.8,.8,1]};
    if(old){const w=Number(old.properties.width),h=Number(old.properties.height);root.transform={position:[0,0,0],rotation:[0,0,0],scale:[w/1000,h/620,1]};
      const holder=createElement('group','2d');holder.name='原图位置';holder.transform=structuredClone(old.transform);if(old.parent)holder.parent=old.parent;elements.push(holder);root.parent=holder.id;root.transform.position=[0,0,0];}
    elements.push(root);
    const add=(e:SceneElement)=>{elements.push(e);if(elements.length+Object.keys(next.elements).length-(old?1:0)>MAX_ELEMENTS)throw Error(`可编辑元素超过 ${MAX_ELEMENTS} 个，请拆分面板、选择数据切片或在配方中明确减少位点。原草稿未修改`);return e;};
    const background=createElement('rect','2d');background.name='画布底色';background.parent=root.id;
    background.properties={width:1000,height:620,fill:gd._fullLayout.paper_bgcolor,stroke:'none',strokeWidth:0,plotSource:{role:'background',source_id:(root.properties.plotSource as any).source_id}};add(background);
    const named=(node:SVGElement,e:SceneElement,parent:string)=>{const meta=semantic(node,gd),n=counts[meta.role]=(counts[meta.role]||0)+1;e.name=`${meta.trace_name?meta.trace_name+' · ':''}${meta.role} ${meta.point_index??n}${node.tagName.toLowerCase()==='text'?' · '+node.textContent:''}`;e.parent=parent;e.properties={...paint(node,plot),...e.properties,plotSource:{source_id:root.properties.plotSource && (root.properties.plotSource as any).source_id,...meta}};return add(e);};
    const convert=async(node:SVGElement,parent:string)=>{
      const tag=node.tagName.toLowerCase(),css=getComputedStyle(node);
      if(['defs','clippath','lineargradient','style','desc','title'].includes(tag)||css.display==='none'||css.visibility==='hidden'||Number(css.opacity)===0||node.matches('.draglayer,.hoverlayer,.zoomlayer,.selectionlayer,.infolayer .legendtoggle'))return;
      if(tag==='g'||tag==='svg'){
        if(!node.children.length)return;const m=matrix(node),p=paint(node,plot);
        if(!node.matches('.trace,.subplot,.legend,.colorbar')&&!p.clipRects&&p.opacity===1&&[m.a,m.b,m.c,m.d,m.e,m.f].every((v,i)=>Math.abs(v-[1,0,0,1,0,0][i])<1e-8)){
          for(const child of [...node.children])await convert(child as SVGElement,parent);return;
        }
        const e=createElement('group','2d');e.properties={};e.transform=transform(m);named(node,e,parent);
        for(const child of [...node.children])await convert(child as SVGElement,e.id);return;
      }
      if(tag==='image'){
        const cd=((node.parentElement as any)?.__data__||[])[0],trace=cd?.trace;
        if(trace?.type!=='heatmap')throw Error('绘图含只有像素的图片，请保留源数据或使用支持的矢量绘图配方');
        if(trace.zsmooth)throw Error('平滑热图不能无损拆成独立单元格，请在配方中显式关闭 zsmooth 后再导入');
        const xa=gd._fullLayout[trace.xaxis.replace(/^x/,'xaxis')],ya=gd._fullLayout[trace.yaxis.replace(/^y/,'yaxis')];
        if(!cd.x||!cd.y||!cd.z)throw Error('热图缺少单元格边界');
        for(let row=0;row<cd.z.length;row++)for(let col=0;col<cd.z[row].length;col++){
          const value=cd.z[row][col];if(value===undefined||value===null)continue;
          const xs=[xa.c2p(cd.x[col]),xa.c2p(cd.x[col+1])].sort((a:number,b:number)=>a-b),ys=[ya.c2p(cd.y[row]),ya.c2p(cd.y[row+1])].sort((a:number,b:number)=>a-b);
          if(![...xs,...ys].every(Number.isFinite))continue;
          const gapX=trace.xgap||0,gapY=trace.ygap||0,w=xs[1]-xs[0]-gapX,h=ys[1]-ys[0]-gapY;if(w<=0||h<=0)continue;
          const e=createElement('rect','2d');e.name=`${trace.name} · cell ${row+1},${col+1}`;e.parent=parent;e.transform.position=[xs[0]+gapX/2,ys[0]+gapY/2,0];
          e.properties={width:w,height:h,fill:heatColor(trace,value),stroke:'none',strokeWidth:0,opacity:1,plotSource:{source_id:(root.properties.plotSource as any).source_id,role:'heatmap-cell',trace_index:gd._fullData.indexOf(trace),row,col,value}};add(e);
        }return;
      }
      let e:SceneElement;
      if(tag==='text'){
        if(!node.textContent?.trim())return;
        // SVG character positions preserve rich labels, superscripts and multiline text.
        const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),runs:Text[]=[];let textNode:Node|null;while(textNode=walker.nextNode())runs.push(textNode as Text);
        let cursor=0;
        for(const run of runs){const text=run.nodeValue||'';if(!text)continue;e=createElement('text','2d');const s=getComputedStyle(run.parentElement!),weight=s.fontWeight==='bold'?700:s.fontWeight==='normal'?400:Number(s.fontWeight)||400;
          const pos=(node as SVGTextElement).getStartPositionOfChar(cursor);cursor+=text.length;
          e.transform=transform(matrix(node).translate(pos.x,pos.y));e.properties={text,fontSize:parseFloat(s.fontSize)||12,fontFamily:s.fontFamily,fontWeight:weight,fontStyle:s.fontStyle,textAnchor:'start',fill:s.fill,stroke:s.stroke,strokeWidth:parseFloat(s.strokeWidth)||0};named(node,e,parent);
        }return;
      } else if(tag==='path') {const d=node.getAttribute('d');if(!d||!/[lLhHvVcCsSqQtTaAzZ]/.test(d)||css.fill==='none'&&css.stroke==='none')return;e=createElement('path','2d');e.properties={d};}
      else if(tag==='rect'){const w=number(node,'width'),h=number(node,'height');if(w<=0||h<=0)return;e=createElement('rect','2d');e.properties={width:w,height:h};e.transform=transform(matrix(node).translate(number(node,'x'),number(node,'y')));named(node,e,parent);return;}
      else if(tag==='circle'||tag==='ellipse'){const rx=number(node,tag==='circle'?'r':'rx'),ry=number(node,tag==='circle'?'r':'ry');if(rx<=0||ry<=0)return;e=createElement('ellipse','2d');e.properties={width:rx*2,height:ry*2};e.transform=transform(matrix(node).translate(number(node,'cx')-rx,number(node,'cy')-ry));named(node,e,parent);return;}
      else if(tag==='line'){e=createElement('line','2d');e.properties={points:[[number(node,'x1'),number(node,'y1')],[number(node,'x2'),number(node,'y2')]]};}
      else if(tag==='polyline'||tag==='polygon'){const nums=(node.getAttribute('points')||'').trim().split(/[ ,]+/).map(Number),points=[];for(let i=0;i<nums.length;i+=2)points.push([nums[i],nums[i+1]]);if(tag==='polygon')points.push(points[0]);e=createElement('polyline','2d');e.properties={points};}
      else if(tag==='a'){for(const child of [...node.children])await convert(child as SVGElement,parent);return;}
      else if(tag==='use')throw Error('绘图包含未展开的字体符号，请使用普通文本标签再导入');
      else throw Error(`暂不支持 SVG 元素 ${tag}，原草稿未修改`);
      e.transform=transform(matrix(node));named(node,e,parent);
    };
    for(const svg of [...plot.querySelectorAll<SVGElement>('.svg-container > svg.main-svg')])await convert(svg,root.id);
    if(!elements.some(e=>e.type!=='group'))throw Error('此绘图没有可导入的 SVG 元素，请使用 line/scatter/heatmap 配方');
    if(old)delete next.elements[old.id];for(const e of elements)next.elements[e.id]=e;validateScene(next);
    return {scene:next,rootId:root.id,source:{id:(root.properties.plotSource as any).source_id,figure:sourceFigure,inputs:request.source?.inputs||[],recipe:request.source?.recipe||{},counts,element_ids:elements.map(e=>e.id),...(old?{original_element:old}:{}),format:'native-svg-v1'}};
  }finally{Plotly?.purge(plot);plot.remove();}
}
