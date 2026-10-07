// Reproducible vendoring from the user's sibling Git checkout; no runtime Node server.
import { createRequire } from 'node:module';
import { resolve, dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const upstream=resolve(process.argv[2]||join(root,'../three-interact'));
const require=createRequire(join(upstream,'package.json'));
const {build}=require('esbuild');
const dest=join(root,'src/research_data/resources/three_interact');await mkdir(dest,{recursive:true});
const python=process.env.RESEARCH_DATA_PYTHON||join(root,process.platform==='win32'?'.venv/Scripts/python.exe':'.venv/bin/python');
const plotly=JSON.parse(execFileSync(python,['-c',"import json; from plotly.offline import get_plotlyjs; from importlib.metadata import distribution; d=distribution('plotly'); license=next(p for p in d.files if '.dist-info/licenses/LICENSE' in str(p)); print(json.dumps({'version':d.version,'javascript':get_plotlyjs(),'license':d.locate_file(license).read_text(encoding='utf-8')}))"],{encoding:'utf8',maxBuffer:16*1024*1024}));
await writeFile(join(dest,'plotly.min.js'),plotly.javascript);
await writeFile(join(dest,'PLOTLY_LICENSE'),plotly.license);
const native=JSON.parse(await readFile(join(dest,'native-editor.json'),'utf8'));
const upstreamHead=execFileSync('git',['-C',upstream,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(upstreamHead!==native.upstream.commit||execFileSync('git',['-C',upstream,'status','--porcelain'],{encoding:'utf8'}).trim())throw new Error('Native editor build requires the recorded clean upstream commit');
const overlays=new Map();
for(const [original,entry] of Object.entries(native.overlays)) {
  const path=normalize(join(upstream,original));
  const hash=createHash('sha256').update(await readFile(path)).digest('hex');
  if(hash!==entry.base_sha256.toLowerCase())throw new Error(`Native overlay base changed: ${original}`);
  overlays.set(path,join(dest,entry.file));
  entry.overlay_sha256=createHash('sha256').update(await readFile(join(dest,entry.file))).digest('hex');
}
native.helper.sha256=createHash('sha256').update(await readFile(join(dest,native.helper.file))).digest('hex');
await writeFile(join(dest,'native-editor.json'),JSON.stringify(native,null,2)+'\n');
overlays.set(normalize(join(upstream,'src/svgStyle.ts')),join(dest,native.helper.file));
const plugin={name:'upstream-source',setup(b){
  b.onResolve({filter:/^@three\//},args=>({path:join(upstream,'src',args.path.slice(7)+'.ts')}));
  b.onResolve({filter:/^\.\.?\//},args=>{const path=normalize(resolve(args.resolveDir,args.path.replace(/\.js$/,'.ts')));const candidate=path.endsWith('.ts')?path:path+'.ts';if(overlays.has(candidate))return {path:candidate};});
  b.onLoad({filter:/\.ts$/},async args=>{const file=overlays.get(normalize(args.path));if(file)return {contents:await readFile(file,'utf8'),loader:'ts',resolveDir:dirname(args.path)};});
}};
export {plugin,upstream,dest};
await build({entryPoints:[join(dest,'host.ts')],outfile:join(dest,'host.js'),bundle:true,minify:true,platform:'browser',format:'iife',plugins:[plugin],nodePaths:[join(upstream,'node_modules')],legalComments:'eof'});
await build({entryPoints:[join(upstream,'webview/main.ts')],outfile:join(dest,'editor.js'),bundle:true,minify:true,platform:'browser',format:'iife',plugins:[plugin],legalComments:'eof'});
await copyFile(join(upstream,'webview/style.css'),join(dest,'style.css'));
await copyFile(join(upstream,'LICENSE'),join(dest,'THREE_INTERACT_LICENSE'));
await copyFile(join(upstream,'THIRD_PARTY_NOTICES.md'),join(dest,'THIRD_PARTY_NOTICES.md'));
const pkg=JSON.parse(await readFile(join(upstream,'package.json'),'utf8'));
const names=['host.ts','plot_import.ts','host.js','editor.js','style.css','index.html','plotly.min.js','THREE_INTERACT_LICENSE','THIRD_PARTY_NOTICES.md','PLOTLY_LICENSE','native-editor.json',...Object.values(native.overlays).map(e=>e.file),native.helper.file];
const files={};for(const name of names)files[name]=createHash('sha256').update(await readFile(join(dest,name))).digest('hex');
await writeFile(join(dest,'vendor.json'),JSON.stringify({schema:'research-data.three-interact-vendor.v1',repository:'https://github.com/fangrh/three-interact',version:pkg.version,commit:execFileSync('git',['-C',upstream,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),dirty:Boolean(execFileSync('git',['-C',upstream,'status','--porcelain'],{encoding:'utf8'}).trim()),native_extension:{schema:native.schema,manifest:'native-editor.json',importer:'native-svg-v1'},plotly_python_version:plotly.version,build_command:'node scripts/vendor-three-interact.mjs ../three-interact',files},null,2)+'\n');
console.log(`Vendored Three Interact ${pkg.version}; ${Object.keys(files).length} files, no runtime server.`);
