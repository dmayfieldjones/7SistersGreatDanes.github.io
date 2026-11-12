const {JSDOM,VirtualConsole,ResourceLoader}=require('jsdom');const fs=require('fs');
// Tests for the private dog page (public/dog-page-demo.html) and its demo backend (public/dog-api.js).
// Run with:  npm i --no-save jsdom   then   node scripts/dogpage-tests/acceptance.cjs   (and nopriv.cjs)
// The same checks are the contract the real server must pass: swap DogAPI for a client of the server and they should still hold.
// acceptance.cjs needs public/data/private/ped-sample.json (git-ignored); nopriv.cjs runs without it.
const PUB=require('path').resolve(__dirname,'../../public');
class Loader extends ResourceLoader{fetch(url){const u=new URL(url);const f=PUB+u.pathname;return fs.existsSync(f)?Promise.resolve(fs.readFileSync(f)):null}}
let gal=null;
exports.make=function({nopriv=false}={}){
  let html=fs.readFileSync(PUB+'/dog-page-demo.html','utf8').replace(/<script src="\/private-gate.js"[^>]*><\/script>/,'');
  if(!gal)gal=fs.readFileSync(PUB+'/breed-galaxy.html','utf8');
  const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
  const ctx=new Proxy({}, {get:(t,k)=>k==='canvas'?{}:()=>{}, set:()=>true});
  const dom=new JSDOM(html,{runScripts:'dangerously',resources:new Loader(),virtualConsole:vc,url:'http://localhost/dog-page-demo.html',pretendToBeVisual:true,beforeParse(w){
    w.HTMLCanvasElement.prototype.getContext=function(){return ctx};
    w.fetch=(u)=>{u=String(u);
      if(u.includes('breed-galaxy'))return Promise.resolve({ok:true,text:()=>Promise.resolve(gal)});
      if(u.includes('ped-sample'))return nopriv?Promise.resolve({ok:false}):Promise.resolve({ok:true,json:()=>Promise.resolve(JSON.parse(fs.readFileSync(PUB+'/data/private/ped-sample.json','utf8')))});
      if(u.includes('demo-authors'))return Promise.resolve({ok:true,json:()=>Promise.resolve(JSON.parse(fs.readFileSync(PUB+'/data/demo-authors.json','utf8')))});
      return Promise.resolve({ok:false})};
    w.scrollTo=()=>{};w.prompt=()=>null;
  }});
  const w=dom.window,d=w.document;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const T=id=>(d.getElementById(id)||{}).textContent.replace(/\s+/g,' ').trim();
  const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true,button:0}));
  const submit=el=>el.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  const find=async q=>{d.getElementById('dogfind').value=q;submit(d.getElementById('findform'));await wait(1300)};
  const actAs=async v=>{const s=d.getElementById('me');s.value=String(v);s.dispatchEvent(new w.Event('change',{bubbles:true}));await wait(500)};
  return {w,d,wait,T,click,submit,find,actAs,errs,API:()=>w.DogAPI};
};
