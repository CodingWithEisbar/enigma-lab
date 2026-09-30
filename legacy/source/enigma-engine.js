/* Enigma I / M3 / M4. All rotor arrays are ordered LEFT to RIGHT. */
const EnigmaCore = (() => {
  'use strict';
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const RAW = {
    I:['EKMFLGDQVZNTOWYHXUSPAIBRCJ','Q'], II:['AJDKSIRUXBLHWTMCQGZNPYFVOE','E'],
    III:['BDFHJLCPRTXVZNYEIWGAKMUSQO','V'], IV:['ESOVPZJAYQUIRHXLNFTGKDCMWB','J'],
    V:['VZBRGITYUPSDNHLXAWMJQOFECK','Z'], VI:['JPGVOUMFYQBENHZRDKASXLICTW','ZM'],
    VII:['NZJHGRCXMYSWBOUFAIVLPEKQDT','ZM'], VIII:['FKQHTLXOCBJSPDZRAMEWNIUYGV','ZM'],
    Beta:['LEYJVCNIXWPBQMDRTAKZGFUHOS',''], Gamma:['FSOKANUERHMBTIYCWLQPZXVGJD','']
  };
  const REF = {A:'EJMZALYXVBWFCRQUONTSPIKHGD', B:'YRUHQSLDPXNGOKMIEBFZCWVJAT', C:'FVPJIAOYEDRZXWGCTKUQSBNMHL',
    'B-thin':'ENKQAUYWJICOPBLMDXZVFTHRGS','C-thin':'RDOBJNTKVEHMLFCWZAXGYIPSUQ'};
  const mod = n => ((n % 26) + 26) % 26;
  const clone = c => JSON.parse(JSON.stringify(c));
  const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'D').toUpperCase().replace(/[^A-Z]/g,'');
  const defaultConfig = (model='I') => ({model, rotors:model==='M4'?['Beta','I','II','III']:['I','II','III'],
    rings:model==='M4'?[0,0,0,0]:[0,0,0], positions:model==='M4'?[0,0,0,0]:[0,0,0], reflector:model==='M4'?'B-thin':'B', plugs:[]});
  function parsePlugs(text) {
    const parts = String(text).trim().toUpperCase().split(/[\s,;]+/).filter(Boolean);
    if(parts.length>13) throw new Error('Plugboard có tối đa 13 cặp dây.');
    const seen = new Set();
    for(const pair of parts) {
      if(!/^[A-Z]{2}$/.test(pair)) throw new Error('Mỗi cặp gồm đúng 2 chữ A–Z, ví dụ: AB CD EF.');
      if(pair[0]===pair[1]) throw new Error('Không thể nối một chữ với chính nó: '+pair+'.');
      for(const c of pair) { if(seen.has(c)) throw new Error('Chữ '+c+' đang được dùng ở nhiều cặp dây.'); seen.add(c); }
    }
    return parts.map(p=>p.split('').sort().join('')).sort();
  }
  function validate(config) {
    if(!config || !['I','M3','M4'].includes(config.model)) throw new Error('Mẫu máy không hợp lệ.');
    const c=clone(config), n=c.model==='M4'?4:3;
    if(!Array.isArray(c.rotors)||c.rotors.length!==n) throw new Error('Số lượng rotor không đúng với mẫu máy.');
    const moving=c.rotors.slice(-3), allowed=c.model==='I'?['I','II','III','IV','V']:['I','II','III','IV','V','VI','VII','VIII'];
    if(moving.some(r=>!allowed.includes(r))||new Set(moving).size!==3) throw new Error('Ba rotor chuyển động phải khác nhau và thuộc mẫu máy.');
    if(n===4&&!['Beta','Gamma'].includes(c.rotors[0])) throw new Error('Rotor trái cùng của M4 phải là Beta hoặc Gamma.');
    const refs=c.model==='M4'?['B-thin','C-thin']:c.model==='I'?['A','B','C']:['B','C'];
    if(!refs.includes(c.reflector)) throw new Error('Reflector không phù hợp với mẫu máy.');
    for(const key of ['rings','positions']) if(!Array.isArray(c[key])||c[key].length!==n||c[key].some(v=>!Number.isInteger(v)||v<0||v>25)) throw new Error('Vị trí và vòng rotor phải trong khoảng A–Z (01–26).');
    if(!Array.isArray(c.plugs)||c.plugs.some(p=>typeof p!=='string')) throw new Error('Danh sách dây cắm không hợp lệ.');
    c.plugs=parsePlugs(c.plugs.join(' '));
    return {model:c.model,rotors:c.rotors,rings:c.rings,positions:c.positions,reflector:c.reflector,plugs:c.plugs};
  }
  const maps=Object.fromEntries(Object.entries(RAW).map(([name,[wiring,notches]])=>{
    const forward=[...wiring].map(c=>ABC.indexOf(c)), inverse=Array(26);
    forward.forEach((v,i)=>inverse[v]=i); return [name,{forward,inverse,notches}];
  }));
  function pass(name,value,position,ring,reverse=false) {
    const offset=position-ring, contact=mod(value+offset);
    return mod(maps[name][reverse?'inverse':'forward'][contact]-offset);
  }
  class Machine {
    constructor(config) { this.config=validate(config); this.positions=[...this.config.positions]; this.plug=Array.from({length:26},(_,i)=>i);
      this.config.plugs.forEach(p=>{const [a,b]=[...p].map(c=>ABC.indexOf(c));this.plug[a]=b;this.plug[b]=a;}); }
    press(letter) {
      if(!/^[A-Z]$/.test(letter)) throw new Error('Máy chỉ nhận một chữ A–Z.');
      const c=this.config,n=c.rotors.length,p=this.positions,before=[...p],m=n-2,r=n-1,l=n-3;
      // The notch travels with the visible index ring: do NOT subtract Ringstellung here.
      const middleNotch=maps[c.rotors[m]].notches.includes(ABC[p[m]]),rightNotch=maps[c.rotors[r]].notches.includes(ABC[p[r]]);
      const stepped=Array(n).fill(false); stepped[r]=true;
      if(middleNotch){p[l]=mod(p[l]+1);stepped[l]=true;}
      if(middleNotch||rightNotch){p[m]=mod(p[m]+1);stepped[m]=true;}
      p[r]=mod(p[r]+1);
      let x=ABC.indexOf(letter); const stages=[];
      const add=(kind,index,label,out,direction)=>{stages.push({kind,index,label,input:x,output:out,direction});x=out;};
      add('plug',null,'Plugboard',this.plug[x],'forward');
      for(let i=n-1;i>=0;i--)add('rotor',i,c.rotors[i],pass(c.rotors[i],x,p[i],c.rings[i]),'forward');
      add('reflector',null,c.reflector,ABC.indexOf(REF[c.reflector][x]),'reflect');
      for(let i=0;i<n;i++)add('rotor',i,c.rotors[i],pass(c.rotors[i],x,p[i],c.rings[i],true),'return');
      add('plug',null,'Plugboard',this.plug[x],'return');
      return {input:letter,output:ABC[x],before,after:[...p],stepped,middleNotch,rightNotch,stages};
    }
    process(text){return [...text].map(c=>this.press(c).output).join('');}
  }
  function selfTests() {
    const results=[],test=(name,fn)=>{try{if(!fn())throw new Error('Kết quả không khớp');results.push({name,ok:true});}catch(e){results.push({name,ok:false,error:e.message});}};
    test('Vector AAAAA → BDZGO',()=>new Machine(defaultConfig()).process('AAAAA')==='BDZGO');
    test('Vector HELLOWORLD → ILBDAAMTAZ',()=>new Machine(defaultConfig()).process('HELLOWORLD')==='ILBDAAMTAZ');
    test('Vector Py-Enigma: vòng B U L + 10 dây',()=>{let c=defaultConfig();c.rotors=['II','IV','V'];c.rings=[1,20,11];c.positions=[1,11,0];c.plugs=parsePlugs('AV BS CG DL FU HZ IN KM OW RX');return new Machine(c).process('THEXRUSSIANSXAREXCOMINGX')==='NIBLFMYMLLUFWCASCSSNVHAZ';});
    test('Khóa bản tin WXC: BLA → KCH',()=>{let c=defaultConfig();c.rotors=['II','IV','V'];c.rings=[1,20,11];c.positions=[22,23,2];c.plugs=parsePlugs('AV BS CG DL FU HZ IN KM OW RX');return new Machine(c).process('BLA')==='KCH';});
    test('Quay kép: ADU → ADV → AEW → BFX',()=>{let c=defaultConfig();c.positions=[0,3,20];let m=new Machine(c);return Array.from({length:3},()=>m.press('A').after.map(i=>ABC[i]).join('')).join(' ')==='ADV AEW BFX';});
    test('Rãnh quay không lệch theo Ringstellung',()=>{let c=defaultConfig();c.positions=[0,3,21];c.rings=[10,12,19];let m=new Machine(c);return m.press('A').after.map(i=>ABC[i]).join('')==='AEW'&&m.press('A').after.map(i=>ABC[i]).join('')==='BFX';});
    test('Rotor VI quay kéo tại M và Z',()=>[12,25].every(pos=>{let c=defaultConfig('M3');c.rotors=['I','II','VI'];c.positions=[0,0,pos];return new Machine(c).press('A').after[1]===1;}));
    test('M4: rotor Greek đứng yên qua 1.000 phím',()=>{let c=defaultConfig('M4');c.positions[0]=13;let m=new Machine(c);m.process('A'.repeat(1000));return m.positions[0]===13;});
    test('M4 Beta A + B-thin tương đương UKW B',()=>new Machine(defaultConfig('M4')).process('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(30))===new Machine(defaultConfig()).process('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(30)));
    test('M4 Gamma A + C-thin tương đương UKW C',()=>{let a=defaultConfig('M4'),b=defaultConfig();a.rotors[0]='Gamma';a.reflector='C-thin';b.reflector='C';return new Machine(a).process(ABC.repeat(30))===new Machine(b).process(ABC.repeat(30));});
    test('Mã hóa ↔ giải mã, M4 với vòng và dây',()=>{let c=defaultConfig('M4');c.rotors=['Gamma','VIII','VI','II'];c.rings=[4,16,25,8];c.positions=[10,3,20,22];c.reflector='C-thin';c.plugs=parsePlugs('AZ BY CX DW EV FU GT HS IR JQ');const plain=ABC.repeat(100),cipher=new Machine(c).process(plain);return new Machine(c).process(cipher)===plain&&[...cipher].every((v,i)=>v!==plain[i]);});
    test('Từ chối dây cắm trùng và rotor trùng',()=>{let count=0;try{parsePlugs('AB AC');}catch(e){count++;}try{let c=defaultConfig();c.rotors=['I','I','III'];validate(c);}catch(e){count++;}return count===2;});
    test('Đảo dây qua rotor khôi phục đủ 26 chữ',()=>Object.keys(maps).every(name=>Array.from({length:26},(_,p)=>Array.from({length:26},(_,r)=>Array.from({length:26},(_,v)=>pass(name,pass(name,v,p,r),p,r,true)===v).every(Boolean)).every(Boolean)).every(Boolean)));
    return results;
  }
  return {ABC,RAW,REF,mod,clone,normalize,defaultConfig,parsePlugs,validate,pass,Machine,selfTests};
})();
if(typeof module!=='undefined')module.exports=EnigmaCore;
