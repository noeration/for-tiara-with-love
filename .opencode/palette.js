const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/Vina/Downloads/project carousel';
const files = [];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory())walk(p); else if(/\.(png|jpe?g)$/i.test(e.name))files.push(p);}}
walk(dir);
const hex = v => v.toString(16).padStart(2,'0');
(async()=>{
for(const f of files){
  const meta = await sharp(f).metadata();
  const {dominant} = await sharp(f).stats();
  const small = await sharp(f).resize(12,16,{fit:'fill'}).removeAlpha().raw().toBuffer();
  console.log('\n=== '+path.basename(f)+' '+meta.width+'x'+meta.height+' fmt='+meta.format+' channels='+meta.channels);
  console.log('dominant #'+[dominant.r,dominant.g,dominant.b].map(hex).join(''));
  for(let y=0;y<16;y++){let row=[];for(let x=0;x<12;x++){const i=(y*12+x)*3;row.push('#'+[small[i],small[i+1],small[i+2]].map(hex).join(''));}console.log(row.join(' '));}
}
})();
