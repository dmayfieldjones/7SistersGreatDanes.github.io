const {JSDOM,VirtualConsole,ResourceLoader}=require('jsdom');const fs=require('fs');
// Tests for the private dog page (public/dog-page-demo.html) and its demo backend (public/dog-api.js).
// Run with:  npm i --no-save jsdom   then   node scripts/dogpage-tests/acceptance.cjs   (and nopriv.cjs)
// The same checks are the contract the real server must pass: swap DogAPI for a client of the server and they should still hold.
// acceptance.cjs needs public/data/private/ped-sample.json (git-ignored); nopriv.cjs runs without it.
const PUB=require('path').resolve(__dirname,'../../public');
class Loader extends ResourceLoader{fetch(url){const u=new URL(url);const f=PUB+u.pathname;return fs.existsSync(f)?Promise.resolve(fs.readFileSync(f)):null}}
let gal=null;
exports.make=function({nopriv=false,host='localhost'}={}){
  let html=fs.readFileSync(PUB+'/dog-page-demo.html','utf8').replace(/<script src="\/private-gate.js"[^>]*><\/script>/,'');
  if(!gal)gal=fs.readFileSync(PUB+'/breed-galaxy.html','utf8');
  const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
  const ctx=new Proxy({}, {get:(t,k)=>k==='canvas'?{}:(k==='createRadialGradient'||k==='createLinearGradient')?()=>({addColorStop(){}}):k==='measureText'?()=>({width:60}):()=>{}, set:()=>true});
  const dom=new JSDOM(html,{runScripts:'dangerously',resources:new Loader(),virtualConsole:vc,url:'http://'+host+'/dog-page-demo.html',pretendToBeVisual:true,beforeParse(w){
    w.HTMLCanvasElement.prototype.getContext=function(){return ctx};
    const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const token=(u,name)=>b64({alg:'none'})+'.'+b64({'cognito:username':u,name,exp:Math.floor(Date.now()/1000)+3600})+'.sig';
    const NAMES={dustin:'Dustin Mayfield-Jones','trial-member':'Trial member',someone:'Someone Else'};
    w.fetch=(u,opt)=>{u=String(u);
      if(u.includes('cognito-idp')){ // behaves like the real user pool: a temporary password must be replaced at first sign-in
        const target=(opt.headers['X-Amz-Target']||'').split('.').pop(),body=JSON.parse(opt.body),bad=()=>Promise.resolve({ok:false,json:()=>Promise.resolve({__type:'com.amazonaws.cognito#NotAuthorizedException',message:'Incorrect username or password.'})});
        const good=n=>Promise.resolve({ok:true,json:()=>Promise.resolve({AuthenticationResult:{IdToken:token(n,NAMES[n])}})});
        if(target==='InitiateAuth'){const U=body.AuthParameters.USERNAME,P=body.AuthParameters.PASSWORD;
          if(P==='Temp-pass-1234'&&NAMES[U])return Promise.resolve({ok:true,json:()=>Promise.resolve({ChallengeName:'NEW_PASSWORD_REQUIRED',Session:'sess-'+U})});
          if(P==='My-chosen-password-1'&&NAMES[U])return good(U);return bad()}
        if(target==='RespondToAuthChallenge'){const U=body.ChallengeResponses.USERNAME;
          if(body.ChallengeResponses.NEW_PASSWORD.length<12)return Promise.resolve({ok:false,json:()=>Promise.resolve({__type:'com.amazonaws.cognito#InvalidPasswordException',message:'Password did not conform with policy: Password not long enough'})});
          return good(U)}
        return bad()}
      if(u.includes('dog-auth'))return Promise.resolve({ok:true,json:()=>Promise.resolve({region:'us-east-2',clientId:'test-client'})});
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
