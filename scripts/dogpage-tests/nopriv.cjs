const {make}=require('./lib.cjs');let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('  FAIL:',m)}};
(async()=>{const t=make({nopriv:true});const {d,wait,T,find,errs,actAs}=t;await wait(2200);await actAs(2);
 for(const [q,call] of [['WS69691106','Piper'],['WS81418801','Mia'],['WS84850303','Cora']]){await find(q);
  ok(T('dog-call').includes(call),call+' opens');ok(/litter record/.test(T('parents'))&&d.querySelectorAll('#parents .pcard').length===2,call+': parents from the litter record');
  ok(/No pedigree data for this dog yet/.test(T('pedgrid')),call+': pedigree says no data');ok(/known ancestors/.test(T('galfacts')),call+': map still works');
  ok(T('dog-breeders').length>20,call+': breeders show');}
 await find('WS11111111');ok(/don't have this dog/.test(T('pendingnote')),'a missing number still gets a page');
 console.log('errors:',errs.length?errs.join('; '):'none');ok(errs.length===0,'no page errors');console.log('RESULT (without the private file):',pass,'passed,',fail,'failed');process.exit(fail?1:0)})();
