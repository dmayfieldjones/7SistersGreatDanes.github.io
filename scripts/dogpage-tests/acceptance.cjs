const {make}=require('./lib.cjs');
let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++}else{fail++;console.log('  FAIL:',m)}};
(async()=>{
 const t=make();const {w,d,wait,T,click,submit,find,actAs,errs}=t;await wait(2200);
 console.log('--- the three dogs');
 ok(T('dog-call').includes('Piper'),'starts on Piper');
 ok(/Jason L Dubman, Francisco Camacho, Priyanka Deshmuhk, Phoebe Dubman/.test(T('dog-breeders')),"Piper's breeders");
 ok(/Karen Mayfield-Jones · member #2/.test(T('dog-owners')),'claimed by');
 ok([...d.querySelectorAll('#offspring button')].length===2,'Piper has 2 offspring in our records');
 ok(d.querySelectorAll('#pedgrid .pn').length===31,'pedigree draws 31 boxes at 4 generations');
 ok(/9522 known ancestors/.test(T('galfacts')),'galaxy facts for Piper');
 ok([...d.querySelectorAll('#dog-regs a')].some(a=>a.href.includes('quicksearch=WS69691106')),'OFA link built from the number');
 ok(/Quintessa Pedigree/.test(T('dog-ped'))&&/River Rock Pedigree/.test(T('dog-ped')),'also-on links');
 await find('WS81418801');ok(T('dog-call').includes('Mia'),'find Mia by number');
 ok(/Earlier owners \(3\)/.test(T('dog-owners'))===false&&/Earlier owners \(3\)/.test(T('own-hist'))===false,'(ownership history is a collapsed note, not in the header)');
 ok(T('own-hist').split(' to ').length-1===3,'Mia has 3 closed ownership periods in the note');
 await find('OFA30F');ok(T('dog-call').includes('Mia'),'find Mia by her OFA number');
 console.log('--- pedigree names open our own page');
 await find('WS69691106');
 click(d.querySelector('#pedgrid a.nm[data-anc="2"]'));await wait(1500);
 ok(/PRF Fendane Have I Gone Mad/.test(T('dog-name')),"opens Piper's sire");
 ok(T('dog-call')==='No call name recorded','no call name for an ancestor');
 ok((T('dog-facts').match(/Born([0-9-]+)/)||[])[1]==='2016-06-06','born date from pedigree data');
 ok(/River Rock photo/.test(T('dog-hero')),'photo tile for a dog with a photo elsewhere');
 ok(/Back to Piper/.test(T('backrow')),'back link');
 const sireName=T('dog-name');click(d.querySelector('#pedgrid a.nm[data-anc="4"]'));await wait(1500);ok(T('dog-name')!==sireName&&T('dog-name').length>5&&T('backrow').includes('Back to'),'one generation deeper opens a different dog, with a way back');
 click(d.querySelector('#backrow a'));await wait(800);click(d.querySelector('#backrow a'));await wait(800);ok(/Legado N Danekraaft/.test(T('dog-name')),'back twice returns to Piper');
 console.log('--- numbers we do not have');
 await find('WS11111111');ok(!d.getElementById('pendingnote').hidden&&/don't have this dog/.test(T('pendingnote')),'pending page');
 ok(/No pedigree data/.test(T('pedgrid')),'no pedigree for a stub');
 await find('WS11111111');
 await find('S28449/72');ok(/on the map, but we don't have its name/.test(T('pendingnote')),'on the map, no names');ok(/Kingsize/.test(T('galfacts')),'galaxy facts for a dog we hold no names for');
 console.log('--- permissions');
 const API=t.API();
 await actAs('v');ok(!d.getElementById('signin').hidden,'visitor sees the sign-in note');
 await find('WS69691106');
 ok(d.getElementById('new-rec').parentNode.hidden&&d.getElementById('new-litter').parentNode.hidden,'visitor cannot see the add forms');
 ok(d.querySelectorAll('#entries form[data-flag]').length===0&&d.querySelectorAll('#entries [data-correct],#entries [data-hide]').length===0,'visitor has no flag/correct/hide buttons');
 ok(/Sign in to see names in the pedigree/.test(T('pedgrid')),'pedigree names need a login');
 ok(d.querySelectorAll('#parents .pcard').length===2,"own litter's parents are public");
 ok(/Not recorded/.test(T('dog-facts')),'no fact forms for a visitor (Died not recorded)');
 await API.addRecord(412,{type:'win',name:'x',url:'http://a'}).then(()=>ok(false,'visitor add should be refused'),e=>ok(e.code==='login_required','visitor add -> login_required'));
 await API.wanted().then(()=>ok(false,'visitor wanted refused'),e=>ok(e.code==='login_required','visitor admin call -> login_required'));
 await actAs(2);// Karen, member
 ok(!d.getElementById('new-rec').parentNode.hidden,'member sees the add form');
 const echo=[...d.querySelectorAll('#entries article')].find(a=>/Echocardiogram/.test(a.textContent)),temp=[...d.querySelectorAll('#entries article')].find(a=>/Temperament/.test(a.textContent));
 ok(echo.querySelector('form[data-flag]')&&!echo.querySelector('[data-correct]')&&!echo.querySelector('[data-hide]'),"member can flag, not correct or hide, someone else's record");
 ok(!temp.querySelector('form[data-flag]')&&temp.querySelector('[data-correct]'),'member can correct but not flag her own record');
 await API.hideClaim(3,'x').then(()=>ok(false,'member hide refused'),e=>ok(e.code==='forbidden','member hide -> forbidden'));
 await API.flagClaim(4,{reason:'x',evidence:'http://e'}).then(()=>ok(false,'flag own refused'),e=>ok(e.code==='forbidden','flag own record -> forbidden'));
 await API.correctClaim(3,'Abnormal').then(()=>ok(false,'correct others refused'),e=>ok(e.code==='forbidden','correct someone else\'s record -> forbidden'));
 await API.addRecord(412,{type:'win',name:'No link',value:'x'}).then(()=>ok(false,'win without evidence refused'),e=>ok(e.code==='invalid','win without an evidence link -> invalid'));
 // add a record through the form
 d.getElementById('nr-type').value='test';d.getElementById('nr-name').value='Hips';d.getElementById('nr-val').value='Good';d.getElementById('nr-date').value='2026-11-12';d.getElementById('nr-url').value='https://example.org/h';
 const before=d.querySelectorAll('#entries article').length;submit(d.getElementById('new-rec'));await wait(300);ok(d.querySelectorAll('#entries article').length===before+1,'a member adds a record through the form');
 // flag through the form
 const f=echo&&[...d.querySelectorAll('#entries article')].find(a=>/Echocardiogram/.test(a.textContent)).querySelector('form[data-flag]');f.elements.ev.value='https://example.org/e2';submit(f);await wait(300);
 ok(/2 flagged/.test(T('entries')),'a member flags a record');
 // correct a fact: Karen did not author the whelp date (#1), so she can dispute but not correct
 ok(/Dispute/.test(T('dog-facts'))&&!/Correct/.test(T('dog-facts').replace('Correct','')),'member can dispute a fact she did not author');
 await actAs(1);// Dustin, author of the echo
 const echo2=[...d.querySelectorAll('#entries article')].find(a=>/Echocardiogram/.test(a.textContent));ok(echo2.querySelector('[data-correct]'),'author can correct their own record');
 await API.correctClaim(3,'Normal (recheck)');await actAs(1);ok(/v2/.test(T('entries')),'a correction makes version 2');
 await actAs(0);// admin
 const echo3=[...d.querySelectorAll('#entries article')].find(a=>/Echocardiogram/.test(a.textContent)&&!/superseded/.test(a.textContent));ok(echo3&&echo3.querySelector('[data-hide]'),'administrator can hide');
 await API.hideClaim(5,'test reason');await actAs(0);ok(/Hidden by administrator/.test(T('entries')),'a hidden record shows its reason and stays in the data');
 click(d.querySelector('[data-tab="admin"]'));await wait(500);
 ok(/WS11111111/.test(T('wanted'))&&/2×/.test(T('wanted')),'wanted list shows the number twice');ok(/S28449\/72/.test(T('wanted'))&&/On the map, no names/.test(T('wanted')),'wanted list marks a dog that is on the map');
 ok(/Administrator hid record/.test(T('log')),'action log');
 await actAs(2);click(d.querySelector('[data-tab="admin"]'));await wait(300);ok(/Administrator only/.test(T('wanted')),'a member sees "Administrator only" in the admin tab');
 console.log('errors in the page:',errs.length?errs.join('; '):'none');ok(errs.length===0,'no page errors');
 console.log('\nRESULT:',pass,'passed,',fail,'failed');process.exit(fail?1:0)})();
