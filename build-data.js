// Regenerates ../data.js from the @pkmn/dex package: npm i @pkmn/dex && node tools/build-data.js (writes data.js in the current directory)
const {Dex}=require('@pkmn/dex');
const fs=require('fs');
const key=b=>[b.hp,b.atk,b.def,b.spa,b.spd,b.spe].join('/');
const all=[...Dex.species.all()].filter(s=>s.num>0&&s.num<=1025&&!['Custom','LGPE'].includes(s.isNonstandard));
const skip=/-Totem|-Gmax|-Starter|Xerneas-Neutral|Eternamax/;
const out=[]; const seen=new Set();
const display=s=>{
  let n=s.name, f=s.forme||'';
  if(!f) return n.replace('Nidoran-F','Nidoran♀').replace('Nidoran-M','Nidoran♂');
  const b=s.baseSpecies;
  if(/Mega/.test(f)) { const t=f.replace('Mega','').replace(/^-|-$/g,''); return 'Mega '+b+(t?' '+t:''); }
  if(f==='Alola') return 'Alolan '+b; if(f==='Galar') return 'Galarian '+b; if(f==='Hisui') return 'Hisuian '+b;
  if(f==='Galar-Zen') return 'Galarian Darmanitan (Zen Mode)';
  if(/^Paldea/.test(f)) return 'Paldean '+b+(f==='Paldea'?'':' ('+f.replace('Paldea-','')+' Breed)');
  if(f==='Primal') return 'Primal '+b;
  return n.replace(/-/g,' ');
};
const regional=f=>/^(Alola|Galar|Hisui|Paldea)/.test(f);
for(const s of all){
  if(skip.test(s.name)) continue;
  const base=Dex.species.get(s.baseSpecies);
  if(s.forme){ if(key(base.baseStats)===key(s.baseStats)) { // identical stats: keep regional/gimmick-distinct only
      if(!regional(s.forme)) continue; // cosmetic or battle-only copy
      // regional with same stats as base: keep (distinct Pokémon)
    } }
  const gen = (s.forme && regional(s.forme)) ? s.gen : base.gen;
  const b=s.baseStats;
  out.push({n:display(s),g:gen,s:[b.hp,b.atk,b.def,b.spa,b.spd,b.spe],num:s.num,f:s.forme?1:0});
}
// stable sort: dex number then base before forms
// Minior: dex base is Core; label explicitly. Meteor is the classic default.
for(const o of out){ if(o.n==='Minior') o.n='Minior Core'; else if(o.n==='Minior Meteor') o.n='Minior'; }
// Collapse same-stat cosmetic siblings (Tauros breeds, Tatsugiri/Meowstic/Magearna megas)
const fix={'Paldean Tauros (Combat Breed)':'Paldean Tauros','Mega Magearna Original':null,'Mega Meowstic F':null,'Mega Tatsugiri Curly':'Mega Tatsugiri','Mega Meowstic M':'Mega Meowstic'};
for(const o of out){ if(o.n in fix) o.n=fix[o.n]; }
for(let i=out.length-1;i>=0;i--){ const o=out[i]; if(o.n===null||/^Paldean Tauros \((Blaze|Aqua) Breed\)$/.test(o.n)||/^Mega Tatsugiri (Droopy|Stretchy)$/.test(o.n)) out.splice(i,1); }
out.sort((a,b)=>a.num-b.num||a.f-b.f);
// dedupe names
const names={};for(const o of out){ if(names[o.n]) console.error('DUP',o.n); names[o.n]=1;}
console.log('total',out.length,'forms',out.filter(o=>o.f).length);
const aliasFix=(n)=>n;
const lines=out.map(o=>`  [${JSON.stringify(o.n)},${o.g},${o.s.join(",")},${o.f}]`).join(',\n');
fs.writeFileSync('data.js',`// Auto-generated Pokémon pool: [name, generation, HP, Atk, Def, SpA, SpD, Spe, isAlternateForm(1/0)]
// Includes Mega Evolutions (incl. Legends Z-A), Primal, regional forms and alternate formes with distinct stats.
const POKEMON_DATA = [
${lines}
];
`);
