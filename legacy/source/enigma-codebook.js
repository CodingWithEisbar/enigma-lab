/* Monthly Enigma key sheets (codebooks). Self-contained seeded JavaScript PRNG. */
const EnigmaCodebook = (() => {
  'use strict';
  const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ', SCHEMA='enigma-codebook', VERSION=1;
  const MOVING={I:['I','II','III','IV','V'],M3:['I','II','III','IV','V','VI','VII','VIII'],M4:['I','II','III','IV','V','VI','VII','VIII']};
  const REFLECTORS={I:['A','B','C'],M3:['B','C'],M4:['B-thin','C-thin']};
  const clone=value=>JSON.parse(JSON.stringify(value));
  let seedCounter=0;
  function newSeed(label='codebook'){
    seedCounter=(seedCounter+1)>>>0;
    const clock=Date.now().toString(36),fine=typeof performance!=='undefined'&&typeof performance.now==='function'?Math.floor(performance.now()*1000).toString(36):'0';
    return String(label||'codebook').replace(/[^a-zA-Z0-9_-]+/g,'-').slice(0,28)+'-'+clock+'-'+fine+'-'+seedCounter.toString(36);
  }
  function hashSeed(value){let h=2166136261>>>0;const text=String(value);for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,2246822507);h^=h>>>13;h=Math.imul(h,3266489909);h^=h>>>16;return h>>>0||0x6d2b79f5;}
  function createRng(seed){
    let state=hashSeed(seed);
    const uint32=()=>{state=(state+0x6d2b79f5)>>>0;let value=state;value=Math.imul(value^(value>>>15),value|1);value^=value+Math.imul(value^(value>>>7),value|61);return (value^(value>>>14))>>>0;};
    const int=max=>{if(!Number.isInteger(max)||max<1)throw new Error('Giới hạn số ngẫu nhiên không hợp lệ.');const limit=Math.floor(0x100000000/max)*max;let value;do{value=uint32();}while(value>=limit);return value%max;};
    const shuffle=values=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=int(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;};
    return {seed:String(seed),uint32,int,shuffle};
  }
  const daysInMonth=(year,month)=>new Date(Date.UTC(year,month,0)).getUTCDate();
  const cleanText=(value,max=80)=>String(value??'').trim().replace(/[\u0000-\u001f\u007f]/g,'').slice(0,max);
  function normalizeModel(model){if(!['I','M3','M4'].includes(model))throw new Error('Mẫu máy phải là I, M3 hoặc M4.');return model;}
  function normalizeRotor(value){const upper=String(value).trim().toUpperCase();return upper==='BETA'?'Beta':upper==='GAMMA'?'Gamma':upper;}
  function tokens(value){return Array.isArray(value)?value:String(value??'').trim().split(/[\s,;|/]+/).filter(Boolean);}
  function normalizePlugs(value){
    const pairs=tokens(value).map(v=>String(v).toUpperCase());if(pairs.length>13)throw new Error('Plugboard có tối đa 13 cặp.');
    const seen=new Set();for(const pair of pairs){if(!/^[A-Z]{2}$/.test(pair)||pair[0]===pair[1])throw new Error('Mỗi dây phải là hai chữ khác nhau, ví dụ AO.');for(const letter of pair){if(seen.has(letter))throw new Error('Chữ '+letter+' bị dùng trong nhiều dây.');seen.add(letter);}}
    return pairs.map(pair=>[...pair].sort().join('')).sort();
  }
  function validateEntry(raw,model){
    model=normalizeModel(model);if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Khóa ngày chưa có dữ liệu.');
    const rotorCount=model==='M4'?4:3,rotors=tokens(raw.rotors).map(normalizeRotor),moving=rotors.slice(-3);
    if(rotors.length!==rotorCount)throw new Error('Walzenlage phải có '+rotorCount+' rotor.');
    if(model==='M4'&&!['Beta','Gamma'].includes(rotors[0]))throw new Error('M4 phải bắt đầu bằng Beta hoặc Gamma.');
    if(moving.some(r=>!MOVING[model].includes(r))||new Set(moving).size!==3)throw new Error('Ba rotor chuyển động phải khác nhau và phù hợp mẫu máy.');
    const rings=tokens(raw.rings).map(Number);if(rings.length!==rotorCount||rings.some(n=>!Number.isInteger(n)||n<1||n>26))throw new Error('Ringstellung cần '+rotorCount+' số từ 01 đến 26.');
    const plugs=normalizePlugs(raw.plugs);const kenngruppen=tokens(raw.kenngruppen).map(v=>String(v).toUpperCase());
    if(kenngruppen.length!==4||kenngruppen.some(v=>!/^[A-Z]{3}$/.test(v))||new Set(kenngruppen).size!==4)throw new Error('Kenngruppen cần 4 nhóm khác nhau, mỗi nhóm 3 chữ A–Z.');
    return {rotors,rings,plugs,kenngruppen};
  }
  function metadata(raw){
    const year=Number(raw.year),month=Number(raw.month),model=normalizeModel(raw.model),reflector=String(raw.reflector||REFLECTORS[model][0]);
    if(!Number.isInteger(year)||year<1900||year>2100)throw new Error('Năm phải trong khoảng 1900–2100.');
    if(!Number.isInteger(month)||month<1||month>12)throw new Error('Tháng phải từ 1 đến 12.');
    if(!REFLECTORS[model].includes(reflector))throw new Error('Reflector không phù hợp mẫu máy.');
    return {name:cleanText(raw.name||'CODEBOOK',80)||'CODEBOOK',network:cleanText(raw.network||'',40),seed:cleanText(raw.seed||'',80),year,month,model,reflector};
  }
  function blankBook(raw={}){const meta=metadata({name:'CODEBOOK',network:'',seed:'',year:1944,month:12,model:'I',reflector:'B',...raw});return {schema:SCHEMA,version:VERSION,...meta,days:{}};}
  function validateBook(raw){
    if(!raw||raw.schema!==SCHEMA||raw.version!==VERSION)throw new Error('File không đúng định dạng Enigma Codebook v1.');
    const book=blankBook(raw),max=daysInMonth(book.year,book.month),source=raw.days;
    if(!source||typeof source!=='object'||Array.isArray(source))throw new Error('Danh sách khóa ngày không hợp lệ.');
    for(const [key,value] of Object.entries(source)){const day=Number(key);if(!Number.isInteger(day)||day<1||day>max)throw new Error('Ngày '+key+' không thuộc tháng đã chọn.');if(value!==null)book.days[String(day)]=validateEntry(value,book.model);}
    return book;
  }
  function allRotorOrders(model){
    const orders=[],values=MOVING[model],greeks=model==='M4'?['Beta','Gamma']:[null];
    for(const greek of greeks)for(const a of values)for(const b of values)for(const c of values)if(a!==b&&a!==c&&b!==c)orders.push(greek?[greek,a,b,c]:[a,b,c]);
    return orders;
  }
  function randomLetters(length,rng){let value='';for(let i=0;i<length;i++)value+=ABC[rng.int(26)];return value;}
  function randomEntry(model,previousRotors=[],usedOrders=new Set(),rngOrSeed=''){
    model=normalizeModel(model);const rng=rngOrSeed&&typeof rngOrSeed.int==='function'?rngOrSeed:createRng(rngOrSeed||newSeed(model));
    const orders=allRotorOrders(model),unused=orders.filter(order=>!usedOrders.has(order.join(' '))),strict=unused.filter(order=>previousRotors.length!==order.length||order.every((rotor,index)=>rotor!==previousRotors[index]));
    const pool=strict.length?strict:unused.length?unused:orders,rotors=pool[rng.int(pool.length)];
    const letters=rng.shuffle([...ABC]).slice(0,20),plugs=[];for(let i=0;i<20;i+=2)plugs.push([letters[i],letters[i+1]].sort().join(''));
    const groups=new Set();while(groups.size<4)groups.add(randomLetters(3,rng));
    return {rotors:[...rotors],rings:Array.from({length:rotors.length},()=>rng.int(26)+1),plugs:plugs.sort(),kenngruppen:[...groups]};
  }
  function generateBook(raw={}){
    const book=blankBook(raw),used=new Set();let previous=[];if(!book.seed)book.seed=newSeed([book.year,book.month,book.model].join('-'));const rng=createRng(book.seed);
    for(let day=daysInMonth(book.year,book.month);day>=1;day--){const entry=randomEntry(book.model,previous,used,rng);book.days[String(day)]=entry;used.add(entry.rotors.join(' '));previous=entry.rotors;}
    return book;
  }
  function randomPosition(model,seed=''){const rng=createRng(seed||newSeed(model+'-position'));return randomLetters(model==='M4'?4:3,rng);}
  function toMachineConfig(book,day,start){
    const validBook=validateBook(book),entry=validBook.days[String(Number(day))],position=String(start||'').trim().toUpperCase();
    if(!entry)throw new Error('Ngày đã chọn chưa có khóa. Hãy nhập hoặc sinh ngẫu nhiên trước.');
    if(!new RegExp('^[A-Z]{'+(validBook.model==='M4'?4:3)+'}$').test(position))throw new Error('Cửa sổ khởi đầu phải gồm '+(validBook.model==='M4'?4:3)+' chữ A–Z.');
    return {model:validBook.model,rotors:[...entry.rotors],rings:entry.rings.map(n=>n-1),positions:[...position].map(c=>ABC.indexOf(c)),reflector:validBook.reflector,plugs:[...entry.plugs]};
  }
  function selfTests(){
    const results=[],test=(name,fn)=>{try{if(!fn())throw new Error('Không khớp');results.push({name,ok:true});}catch(error){results.push({name,ok:false,error:error.message});}};
    test('Tháng nhuận có 29 ngày',()=>daysInMonth(1944,2)===29);
    test('Cùng seed sinh cùng bảng tháng',()=>JSON.stringify(generateBook({year:1944,month:12,model:'I',reflector:'B',seed:'TEST-1944'}).days)===JSON.stringify(generateBook({year:1944,month:12,model:'I',reflector:'B',seed:'TEST-1944'}).days));
    test('Từ chối dây cắm lặp',()=>{try{validateEntry({rotors:['I','II','III'],rings:[1,2,3],plugs:['AB','AC'],kenngruppen:['AAA','BBB','CCC','DDD']},'I');return false;}catch(e){return true;}});
    test('Chuyển 01–26 sang chỉ số 0–25',()=>{const b=blankBook();b.days['31']=validateEntry({rotors:['II','III','IV'],rings:[20,4,5],plugs:'AO BQ CL EH FT GZ IM JV KR PW',kenngruppen:'EYF KVV GOV SML'},'I');const c=toMachineConfig(b,31,'AAA');return c.rings.join(',')==='19,3,4'&&c.plugs.length===10;});
    return results;
  }
  return {ABC,SCHEMA,VERSION,MOVING,REFLECTORS,clone,daysInMonth,blankBook,validateEntry,validateBook,generateBook,randomEntry,randomPosition,newSeed,createRng,randomSource:()=> 'javascript-prng',toMachineConfig,selfTests};
})();
if(typeof module!=='undefined')module.exports=EnigmaCodebook;

if(typeof document!=='undefined')(() => {
  'use strict';
  const C=EnigmaCodebook,$=id=>document.getElementById(id),pad=n=>String(n).padStart(2,'0');
  let book=C.blankBook({name:'U571 · MẪU THÁNG 12',network:'GEHEIM',seed:'U571-1944-12',year:1944,month:12,model:'I',reflector:'B'}),selectedDay=31;
  book.days['31']=C.validateEntry({rotors:'II III IV',rings:'20 04 05',plugs:'AO BQ CL EH FT GZ IM JV KR PW',kenngruppen:'EYF KVV GOV SML'},'I');
  function notify(message){if(window.EnigmaLab&&window.EnigmaLab.toast)window.EnigmaLab.toast(message);}
  function selectedMeta(){return {name:$('bookName').value,network:$('bookNetwork').value,seed:$('bookSeed').value,year:Number($('bookYear').value),month:Number($('bookMonth').value),model:$('bookModel').value,reflector:$('bookReflector').value};}
  function renderReflectors(){const model=$('bookModel').value,current=$('bookReflector').value,values=C.REFLECTORS[model];$('bookReflector').replaceChildren(...values.map(v=>{const option=document.createElement('option');option.value=v;option.textContent=v.replace('-thin',' · mỏng');option.selected=v===current;return option;}));}
  function title(){const month=pad(book.month),count=Object.keys(book.days).length;$('bookActiveTitle').textContent=book.name;$('bookActiveMeta').textContent=(book.network?book.network+' · ':'')+'THÁNG '+month+'/'+book.year+' · ENIGMA '+book.model+' · UKW '+book.reflector+' · '+count+'/'+C.daysInMonth(book.year,book.month)+' NGÀY'+(book.seed?' · SEED '+book.seed:'');}
  function renderTable(){
    const body=$('bookDaysBody');body.replaceChildren();
    for(let day=C.daysInMonth(book.year,book.month);day>=1;day--){const entry=book.days[String(day)],row=document.createElement('tr');if(day===selectedDay)row.className='selected';
      const values=[pad(day),entry?entry.rotors.join(' · '):'—',entry?entry.rings.map(pad).join(' '):'—',entry?entry.plugs.join(' '):'—',entry?entry.kenngruppen.join(' '):'—'];
      values.forEach((value,index)=>{const cell=document.createElement(index===0?'th':'td');if(index===0)cell.scope='row';cell.textContent=value;row.append(cell);});
      const action=document.createElement('td'),button=document.createElement('button');button.className='btn ghost small';button.dataset.bookDay=String(day);button.textContent=entry?'Sửa':'Nhập';button.setAttribute('aria-label',(entry?'Sửa':'Nhập')+' khóa ngày '+day);action.append(button);row.append(action);body.append(row);
    }
  }
  function loadEditor(){
    const entry=book.days[String(selectedDay)];$('bookDayTitle').textContent='Ngày '+pad(selectedDay)+' / '+pad(book.month)+' / '+book.year;$('bookDayStatus').textContent=entry?'Đã có khóa':'Chưa có khóa';
    $('bookRotors').value=entry?entry.rotors.join(' '):'';$('bookRings').value=entry?entry.rings.map(pad).join(' '):'';$('bookPlugs').value=entry?entry.plugs.join(' '):'';$('bookGroups').value=entry?entry.kenngruppen.join(' '):'';
    const need=book.model==='M4'?4:3;$('bookRotors').placeholder=need===4?'Beta II IV VI':'II III IV';$('bookRings').placeholder=need===4?'01 20 04 05':'20 04 05';
    const start=$('bookStart').value.trim().toUpperCase();if(!new RegExp('^[A-Z]{'+need+'}$').test(start))$('bookStart').value='A'.repeat(need);$('bookError').textContent='';
  }
  function render(){title();renderTable();loadEditor();}
  function readEditor(){return C.validateEntry({rotors:$('bookRotors').value,rings:$('bookRings').value,plugs:$('bookPlugs').value,kenngruppen:$('bookGroups').value},book.model);}
  function saveDay(showToast=true){try{book.days[String(selectedDay)]=readEditor();render();if(showToast)notify('Đã lưu khóa ngày '+pad(selectedDay)+'.');return true;}catch(error){$('bookError').textContent=error.message;return false;}}
  function randomLabel(){return 'bộ sinh JavaScript nội bộ';}
  function showSetup(message,error=false){$('bookSetupStatus').textContent=message;$('bookSetupStatus').classList.toggle('error',error);$('bookSetupError').textContent=error?message:'';}
  function createBook(random){
    showSetup(random?'Đang tạo khóa cho toàn bộ tháng…':'Đang tạo bảng trống…');
    try{book=random?C.generateBook(selectedMeta()):C.blankBook(selectedMeta());selectedDay=C.daysInMonth(book.year,book.month);$('bookSeed').value=book.seed;$('bookStart').value='A'.repeat(book.model==='M4'?4:3);render();const message=random?'Đã sinh '+Object.keys(book.days).length+' khóa ngày bằng '+randomLabel()+' · seed '+book.seed+'.':'Đã tạo bảng tháng trống.';showSetup(message);notify(message);}catch(error){showSetup('Không thể tạo Codebook: '+error.message,true);}
  }
  window.EnigmaCodebookUI={generateMonth:()=>createBook(true),createBlank:()=>createBook(false),newSeed:()=>{const seed=C.newSeed([$('bookYear').value,$('bookMonth').value,$('bookModel').value].join('-'));$('bookSeed').value=seed;showSetup('Đã tạo seed JavaScript mới: '+seed);return seed;}};
  $('bookModel').addEventListener('change',renderReflectors);$('bookBlank').addEventListener('click',window.EnigmaCodebookUI.createBlank);$('bookGenerate').addEventListener('click',window.EnigmaCodebookUI.generateMonth);$('bookNewSeed').addEventListener('click',window.EnigmaCodebookUI.newSeed);
  $('bookDaysBody').addEventListener('click',event=>{const button=event.target.closest('[data-book-day]');if(!button)return;selectedDay=Number(button.dataset.bookDay);render();$('bookEditor').scrollIntoView({block:'nearest',behavior:'smooth'});});
  $('bookSaveDay').addEventListener('click',()=>saveDay());$('bookRandomDay').addEventListener('click',()=>{try{const seed=C.newSeed((book.seed||'codebook')+'-day-'+selectedDay);book.days[String(selectedDay)]=C.randomEntry(book.model,[],new Set(),seed);render();const message='Đã sinh khóa ngày '+pad(selectedDay)+' bằng '+randomLabel()+'.';showSetup(message);notify(message);}catch(error){$('bookError').textContent='Không thể sinh khóa: '+error.message;}});
  $('bookRandomStart').addEventListener('click',()=>{try{$('bookStart').value=C.randomPosition(book.model,C.newSeed((book.seed||'codebook')+'-position'));notify('Đã sinh cửa sổ khởi đầu bằng '+randomLabel()+'.');}catch(error){$('bookError').textContent='Không thể sinh cửa sổ: '+error.message;}});
  $('bookApply').addEventListener('click',()=>{if(!saveDay(false))return;try{const config=C.toMachineConfig(book,selectedDay,$('bookStart').value);window.EnigmaLab.applyConfig(config,'Đang dùng khóa Codebook ngày '+pad(selectedDay)+'/'+pad(book.month)+'/'+book.year+'. Kenngruppen: '+book.days[String(selectedDay)].kenngruppen.join(' '));window.EnigmaLab.setTab('machine');notify('Đã áp khóa ngày '+pad(selectedDay)+' vào bàn máy.');}catch(error){$('bookError').textContent=error.message;}});
  $('bookExport').addEventListener('click',()=>{const safe=(book.name||'codebook').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'codebook';window.EnigmaLab.download(safe+'-'+book.year+'-'+pad(book.month)+'.json',JSON.stringify(C.validateBook(book),null,2),'application/json');});
  $('bookImport').addEventListener('click',()=>$('bookImportFile').click());$('bookImportFile').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>1000000)throw new Error('File Codebook vượt quá 1 MB.');book=C.validateBook(JSON.parse(await file.text()));selectedDay=C.daysInMonth(book.year,book.month);$('bookName').value=book.name;$('bookNetwork').value=book.network;$('bookSeed').value=book.seed;$('bookYear').value=book.year;$('bookMonth').value=book.month;$('bookModel').value=book.model;renderReflectors();$('bookReflector').value=book.reflector;render();notify('Đã nhập Codebook '+pad(book.month)+'/'+book.year+'.');}catch(error){notify('Không thể nhập Codebook: '+error.message);}finally{event.target.value='';}});
  $('dockCodebook').addEventListener('click',()=>window.EnigmaLab.setTab('codebook'));
  for(const id of ['bookRotors','bookRings','bookPlugs','bookGroups','bookStart'])$(id).addEventListener('input',()=>{$('bookError').textContent='';});
  renderReflectors();render();window.EnigmaLab.codebook={core:C,getBook:()=>C.clone(book),getSelectedDay:()=>selectedDay,selfTests:C.selfTests};
})();
