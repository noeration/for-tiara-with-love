const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/Vina/Downloads/project carousel/references';
const files = fs.readdirSync(dir).filter(f=>/\.jpe?g$/i.test(f));
const hex=v=>v.toString(16).padStart(2,'0');
(async()=>{
for(const f of files){
  const p=path.join(dir,f);
  const W=32,H=40;
  const {data}=await sharp(p).resize(W,H,{fit:'fill'}).raw().toBuffer({resolveWithObject:true});
  const full=await sharp(p).resize(160,200,{fit:'fill'}).removeAlpha().raw().toBuffer();
  const colors=new Map();
  for(let i=0;i<full.length;i+=3){
    const r=full[i],g=full[i+1],b=full[i+2];
    if(r>235&&g>235&&b>235) continue;
    const k=[r>>5<<5,g>>5<<5,b>>5<<5].join(',');
    colors.set(k,(colors.get(k)||0)+1);
  }
  const top=[...colors.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=>{const [r,g,b]=k.split(',').map(Number);return '#'+[r,g,b].map(hex).join('')+':'+v;});
  console.log('\n=== '+f);
  console.log('top non-white:',top.join(' '));
  let map='';
  for(let y=0;y<H;y++){
    let row='';
    for(let x=0;x<W;x++){
      const i=(y*W+x)*3; const r=data[i],g=data[i+1],b=data[i+2];
      const max=Math.max(r,g,b),min=Math.min(r,g,b),lum=(r+g+b)/3,sat=max-min;
      let c;
      if(lum>240) c='.';
      else if(lum>220) c=',';
      else if(b>r+25&&b>g+10&&lum<200) c='B';
      else if(lum<80) c='#';
      else if(sat<14) c='p';
      else c='o';
      row+=c;
    }
    map+=row+'\n';
  }
  console.log(map);
}
})();
