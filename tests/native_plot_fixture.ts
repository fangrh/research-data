// Browser acceptance fixture: synthetic inputs only, real production host/editor.
import {createScene,createElement} from '@three/model';
import {serializeSvg} from '@three/export2d';
const frame=document.querySelector<HTMLIFrameElement>('iframe')!,summary=document.querySelector<HTMLPreElement>('#summary')!;
const marker={type:'scatter',mode:'markers',x:[0,1,2,3,4],y:[1,4,2,5,3],name:'Sites',marker:{size:12,color:'#00aeec'}};
const curve={...marker,name:'Curve',mode:'lines',line:{color:'#e35d9c',width:3,dash:'dash'}};
const layout={title:{text:'Native editable plot'},font:{family:'Arial',size:14},xaxis:{title:{text:'Position'}},yaxis:{title:{text:'Value'}},showlegend:true,paper_bgcolor:'white',plot_bgcolor:'white',margin:{l:70,r:70,t:65,b:65}};
const heat={type:'heatmap',x:[0,2,5],y:[1,3],z:[[1,4,2],[3,6,5]],colorscale:'Viridis',name:'Map',colorbar:{title:{text:'Response'}}};
const fixtures:any={scatter:{data:[marker],layout},line:{data:[curve],layout},compare:{data:[curve,{...curve,name:'Other',y:[2,3,5,1,4],line:{color:'blue',width:2}}],layout},
  complex:{data:[{...curve,name:'real'},{...curve,name:'imag',y:[-1,-2,3,0,1]}],layout},heatmap:{data:[heat],layout},
  panels:{data:[marker,{...heat,xaxis:'x2',yaxis:'y2'}],layout:{...layout,xaxis:{...layout.xaxis,domain:[0,.4]},yaxis:{...layout.yaxis,domain:[0,1]},xaxis2:{domain:[.58,1],anchor:'y2'},yaxis2:{domain:[0,1],anchor:'x2'}}},
  log:{data:[{...marker,x:[1,10,100,1000,10000]}],layout:{...layout,xaxis:{type:'log',autorange:'reversed',title:{text:'Log position'}}}},
  rich:{data:[{...marker,marker:{size:40,color:'rgba(0,150,250,.4)'},x:[0,1,2,3,4]}],layout:{...layout,xaxis:{range:[0,4],title:{text:'Position <sup>2</sup>'},tickangle:35},title:{text:'A <i>rich</i> title'}}},
  limit:{data:[{...marker,x:Array.from({length:10001},(_,i)=>i),y:Array.from({length:10001},(_,i)=>Math.sin(i))}],layout},
  smooth:{data:[{...heat,zsmooth:'best'}],layout},legacy:{data:[marker],layout}};
let payload:any,hash='fixture',identity='',generation=0;
const publish=(args:any)=>frame.contentWindow?.postMessage({type:'streamlit:render',args},location.origin);
function render(ack=''){publish({payload,draft_hash:hash,identity,reset_token:generation,acknowledged_event:ack,saved_notice:ack?'fixture 已保存':''});}
document.querySelector<HTMLSelectElement>('select')!.onchange=()=>load();
document.querySelector<HTMLButtonElement>('#reload')!.onclick=()=>{generation++;render();};
document.querySelector<HTMLButtonElement>('#save')!.onclick=()=>{const s=JSON.stringify(payload);localStorage.setItem('native-fixture-'+identity,s);summary.textContent+='\nRoundtrip: '+(JSON.stringify(JSON.parse(s).scene)===JSON.stringify(payload.scene));};
document.querySelector<HTMLButtonElement>('#compare')!.onclick=async()=>{
  const scene=structuredClone(payload.scene),root=Object.values(scene.elements).find((e:any)=>e.properties.plotSource?.role==='plot') as any;
  root.transform={position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]};
  let svg=serializeSvg(scene,{}).replace(/viewBox="[^"]*"/,'viewBox="0 0 1000 620"').replace(/width="[^"]*"/,'width="1000"').replace(/height="[^"]*"/,'height="620"');
  const reference=frame.contentDocument!.createElement('div');reference.style.cssText='position:fixed;left:-20000px;width:1000px;height:620px';frame.contentDocument!.body.append(reference);
  const Plotly=(frame.contentWindow as any).Plotly,f=structuredClone(fixtures[identity]);
  await Plotly.newPlot(reference,f.data,{...f.layout,width:1000,height:620},{staticPlot:true});
  const original=await Plotly.toImage(reference,{format:'png',width:1000,height:620});
  const pixels=async(src:string)=>{const img=new Image();img.src=src;await img.decode();const c=document.createElement('canvas');c.width=1000;c.height=620;const ctx=c.getContext('2d')!;ctx.fillStyle='white';ctx.fillRect(0,0,1000,620);ctx.drawImage(img,0,0,1000,620);return ctx.getImageData(0,0,1000,620).data;};
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{const a=await pixels(original),b=await pixels(url);let sum=0,changed=0,overlap=0,union=0;for(let i=0;i<a.length;i+=4){let delta=0;for(let j=0;j<3;j++)delta+=Math.abs(a[i+j]-b[i+j]);sum+=delta;if(delta>96)changed++;const ap=a[i]+a[i+1]+a[i+2]<700,bp=b[i]+b[i+1]+b[i+2]<700;if(ap||bp)union++;if(ap&&bp)overlap++;}
    document.querySelector('#comparison')!.textContent=JSON.stringify({fixture:identity,mean_channel_error:sum/(1000*620*3*255),changed_fraction:changed/(1000*620),ink_overlap:overlap/union},null,2);
  }finally{URL.revokeObjectURL(url);Plotly.purge(reference);reference.remove();}
};
document.querySelector<HTMLButtonElement>('#audit')!.onclick=()=>{
  const es=Object.values(payload.scene.elements) as any[],roles:any={};es.forEach(e=>{const role=e.properties.plotSource?.role||e.type;roles[role]=(roles[role]||0)+1;});
  const svg=serializeSvg(payload.scene,payload.assets);document.querySelector<HTMLTextAreaElement>('#scene')!.value=JSON.stringify(payload);
  summary.textContent=JSON.stringify({fixture:identity,elements:es.length,images:es.filter(e=>e.type==='image').length,roles,svgHasImage:svg.includes('<image'),sceneId:payload.scene.id,exported:!!payload.figure_png},null,2);
  document.querySelector('#export')!.innerHTML=svg;
};
function load(){const name=document.querySelector<HTMLSelectElement>('select')!.value;identity=name;generation++;hash='fixture-'+generation;
  payload={schema:'research-data.proof-draft.v1',scene:createScene('2d'),assets:{},editor:{history:[],orders:[],seed_plotly:fixtures[name],seed_plotly_request:{token:crypto.randomUUID(),source:{inputs:[],recipe:{kind:name}}}}};
  if(['limit','smooth','legacy'].includes(name)){
    const old=createElement('image','2d');old.name='Data plot · panel a';old.properties={width:800,height:496,src:'original.png'};old.transform={position:[50,75,0],rotation:[0,0,.4],scale:[.6,.9,1]};
    const note=createElement('text','2d');note.name='Preserved annotation';note.properties.text='Annotation must survive';note.transform.position=[100,20,0];
    payload.scene.elements[old.id]=old;payload.scene.elements[note.id]=note;payload.assets['original.png']='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=';
    payload.editor.seed_plotly_request.replace_element_id=old.id;
    document.querySelector<HTMLTextAreaElement>('#scene')!.value=JSON.stringify(payload);
  }
  render();summary.textContent='Loading '+name;}
window.addEventListener('message',event=>{if(event.source!==frame.contentWindow)return;const message=event.data;if(message.type==='streamlit:componentReady'){load();}if(message.type==='streamlit:setComponentValue'){
  payload={...payload,...message.value};hash='fixture-'+crypto.randomUUID();render(message.value.event_id);document.querySelector('#audit')?.dispatchEvent(new MouseEvent('click'));}
});
frame.onload=()=>load();
