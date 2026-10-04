(() => {
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RTL=/[\u0590-\u08ff\ufb1d-\ufeff]/;
const strip=s=>String(s||'').trim().replace(/^["']|["']$/g,'').replace(/<br\s*\/?>/gi,'\n');
const clean=s=>strip(s).replace(/\\n/g,'\n');
const textMetrics=s=>{const lines=clean(s).split('\n');const max=Math.max(...lines.map(x=>[...x].reduce((n,ch)=>n+(RTL.test(ch)?9.3:/[A-Z0-9]/.test(ch)?8:6.6),0)),30);return {lines,w:Math.min(340,Math.max(112,max+42)),h:Math.max(54,lines.length*25+25)}};
function htmlLabel(x,y,w,h,text,cls='mm-html-label'){
 const rtl=RTL.test(text), lines=clean(text).split('\n').map(esc).join('<br>');
 return `<foreignObject x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" class="${cls}"><div xmlns="http://www.w3.org/1999/xhtml" class="mm-label ${rtl?'rtl':'ltr'}" dir="${rtl?'rtl':'ltr'}">${lines}</div></foreignObject>`;
}
function parseNodeToken(t){
 t=t.trim(); let m=t.match(/^([\w\u0600-\u06FF-]+)(?:\["?([\s\S]*?)"?\]|\{"?([\s\S]*?)"?\}|\("?([\s\S]*?)"?\))?$/);
 if(!m)return {id:t,label:t,shape:'rect'};
 return {id:m[1],label:clean(m[2]??m[3]??m[4]??m[1]),shape:m[3]!=null?'diamond':m[4]!=null?'round':'rect'};
}
function parseGraph(source){
 const raw=source.split(/\r?\n/), first=(raw.shift()||'graph TB').trim(); const dir=/\b(LR|RL|BT|TB)\b/i.exec(first)?.[1].toUpperCase()||'TB';
 const nodes=new Map(),edges=[],groups=[]; let current=null;
 for(let line of raw){line=line.trim();if(!line||line.startsWith('%%'))continue;
  if(/^subgraph\b/i.test(line)){const m=line.match(/^subgraph\s+([^\[]+?)(?:\["?(.+?)"?\])?$/i);current={id:(m?.[1]||'group').trim(),label:clean(m?.[2]||m?.[1]||''),nodes:[]};groups.push(current);continue;}
  if(/^end$/i.test(line)){current=null;continue;}
  const em=line.match(/^(.+?)\s*(<-->|==>|-.->|-->|---)\s*(?:\|"?(.+?)"?\|\s*)?(.+)$/);
  if(em){const a=parseNodeToken(em[1]),b=parseNodeToken(em[4]);nodes.set(a.id,{...(nodes.get(a.id)||{}),...a});nodes.set(b.id,{...(nodes.get(b.id)||{}),...b});edges.push({a:a.id,b:b.id,label:clean(em[3]||''),kind:em[2]});if(current){for(const id of [a.id,b.id])if(!current.nodes.includes(id))current.nodes.push(id);}continue;}
  const n=parseNodeToken(line);nodes.set(n.id,{...(nodes.get(n.id)||{}),...n});if(current&&!current.nodes.includes(n.id))current.nodes.push(n.id);
 }
 return {nodes:[...nodes.values()],edges,groups,dir,isState:false};
}
function parseState(source){
 const lines=source.split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!/^stateDiagram/i.test(x)&&!/^direction\b/i.test(x)&&!x.startsWith('%%'));
 const nodes=new Map(),edges=[];const dir=/direction\s+(LR|RL|BT|TB)/i.exec(source)?.[1].toUpperCase()||'LR';
 for(const line of lines){const m=line.match(/^(.+?)\s*-->\s*(.+?)(?:\s*:\s*(.+))?$/);if(!m)continue;const a=clean(m[1]),b=clean(m[2]);const aid=a==='[*]'?'__start':a.replace(/\s+/g,'_'),bid=b==='[*]'?'__end':b.replace(/\s+/g,'_');nodes.set(aid,{id:aid,label:a==='[*]'?'':a,shape:a==='[*]'?'start':'round'});nodes.set(bid,{id:bid,label:b==='[*]'?'':b,shape:b==='[*]'?'end':'round'});edges.push({a:aid,b:bid,label:clean(m[3]||''),kind:'-->'});}
 return {nodes:[...nodes.values()],edges,groups:[],dir,isState:true};
}
function draw(model){
 const {nodes,edges,groups,dir,isState}=model,horizontal=dir==='LR'||dir==='RL',reverse=dir==='RL'||dir==='BT';
 const nodeMap=new Map(nodes.map(n=>[n.id,n])), indeg=new Map(nodes.map(n=>[n.id,0])); for(const e of edges)indeg.set(e.b,(indeg.get(e.b)||0)+1);
 const depth=new Map(nodes.map(n=>[n.id,0])); for(let k=0;k<nodes.length+2;k++)for(const e of edges)depth.set(e.b,Math.max(depth.get(e.b)||0,(depth.get(e.a)||0)+1));
 const levels=new Map();for(const n of nodes){const d=depth.get(n.id)||0;if(!levels.has(d))levels.set(d,[]);levels.get(d).push(n);} const maxDepth=Math.max(0,...levels.keys());
 const metrics=new Map(nodes.map(n=>[n.id,textMetrics(n.label)])); const mainGap=horizontal?260:155,crossGap=horizontal?125:260,margin=95; const pos=new Map();let maxCross=1;
 for(const [d,arr] of [...levels.entries()].sort((a,b)=>a[0]-b[0])){maxCross=Math.max(maxCross,arr.length);arr.forEach((n,j)=>{const dd=reverse?maxDepth-d:d;const main=margin+dd*mainGap,cross=margin+j*crossGap;pos.set(n.id,horizontal?{x:main,y:cross}:{x:cross,y:main});});}
 const width=horizontal?Math.max(720,margin*2+maxDepth*mainGap+280):Math.max(720,margin*2+(maxCross-1)*crossGap+300);
 const height=horizontal?Math.max(360,margin*2+(maxCross-1)*crossGap+160):Math.max(360,margin*2+maxDepth*mainGap+180);
 const box=id=>{const p=pos.get(id),m=metrics.get(id)||{w:112,h:54};return {...p,...m}};
 let svg=`<svg class="mermaid-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mermaid diagram"><defs><marker id="mm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="mm-arrow"/></marker></defs>`;
 for(const g of groups){const bs=g.nodes.filter(id=>pos.has(id)).map(box);if(!bs.length)continue;const x=Math.min(...bs.map(b=>b.x-b.w/2))-34,y=Math.min(...bs.map(b=>b.y-b.h/2))-66,x2=Math.max(...bs.map(b=>b.x+b.w/2))+34,y2=Math.max(...bs.map(b=>b.y+b.h/2))+34;svg+=`<g class="mm-group"><rect x="${x}" y="${y}" width="${x2-x}" height="${y2-y}" rx="18"/>${htmlLabel(x+(x2-x)/2,y+25,Math.max(150,x2-x-24),34,g.label,'mm-group-label')}</g>`;}
 for(const e of edges){if(!pos.has(e.a)||!pos.has(e.b))continue;const a=box(e.a),b=box(e.b);let x1=a.x,y1=a.y,x2=b.x,y2=b.y;if(horizontal){const sign=x2>=x1?1:-1;x1+=sign*a.w/2;x2-=sign*b.w/2;}else{const sign=y2>=y1?1:-1;y1+=sign*a.h/2;y2-=sign*b.h/2;}const mx=(x1+x2)/2,my=(y1+y2)/2;const dash=e.kind.includes('.')?' stroke-dasharray="7 6"':'';svg+=`<g class="mm-edge"><path d="M${x1} ${y1} C${horizontal?mx:x1} ${horizontal?y1:my},${horizontal?mx:x2} ${horizontal?y2:my},${x2} ${y2}"${dash} marker-end="url(#mm-arrow)"/>`;
  if(e.label){const m=textMetrics(e.label),ew=Math.min(300,Math.max(100,m.w)),eh=Math.max(36,m.h-10);svg+=`<rect class="mm-edge-bg" x="${mx-ew/2}" y="${my-eh/2}" width="${ew}" height="${eh}" rx="8"/>${htmlLabel(mx,my,ew,eh,e.label,'mm-edge-label')}`;}svg+='</g>';}
 for(const n of nodes){const b=box(n);if(n.shape==='start'||n.shape==='end'){svg+=`<g class="mm-node mm-state-dot"><circle cx="${b.x}" cy="${b.y}" r="${n.shape==='end'?14:9}"/>${n.shape==='end'?`<circle class="inner" cx="${b.x}" cy="${b.y}" r="7"/>`:''}</g>`;continue;}const shape=n.shape==='diamond'?`<polygon points="${b.x},${b.y-b.h/2} ${b.x+b.w/2},${b.y} ${b.x},${b.y+b.h/2} ${b.x-b.w/2},${b.y}"/>`:`<rect x="${b.x-b.w/2}" y="${b.y-b.h/2}" width="${b.w}" height="${b.h}" rx="${n.shape==='round'||isState?15:9}"/>`;svg+=`<g class="mm-node">${shape}${htmlLabel(b.x,b.y,b.w-18,b.h-12,n.label)}</g>`;}
 return svg+'</svg>';
}
window.MaestroMermaid={render:src=>draw(/^stateDiagram/i.test(src.trim())?parseState(src):parseGraph(src))};
})();
