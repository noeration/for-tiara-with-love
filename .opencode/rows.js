const sharp = require('sharp');
const dir = 'C:/Users/Vina/Documents/Default Project/carousel-final';
async function rows(file, y0, y1, x0, x1, test, label) {
  const { data, info } = await sharp(dir+'/'+file).extract({left:x0,top:y0,width:x1-x0,height:y1-y0}).raw().toBuffer({resolveWithObject:true});
  const out = [];
  for (let y=0;y<info.height;y++){
    let n=0;
    for (let x=0;x<info.width;x++){
      const i=(y*info.width+x)*info.channels;
      if (test(data[i],data[i+1],data[i+2])) n++;
    }
    out.push([y+y0,n]);
  }
  const runs=[]; let cur=null;
  for (const [y,n] of out){
    if (n>3){ if(!cur) cur=[y,y,n]; else {cur[1]=y;cur[2]+=n;} }
    else if (cur){ runs.push(cur); cur=null; }
  }
  if (cur) runs.push(cur);
  console.log(label, runs.map(r=>`${r[0]}-${r[1]} (${r[2]})`).join(' | '));
}
(async()=>{
  const cobalt=(r,g,b)=> b>150 && b-r>90 && b-g>80;
  const ink=(r,g,b)=> r<80&&g<80&&b<90;
  const bone=(r,g,b)=> r>200&&g>190&&b>170;
  await rows('01-hook.png',180,760,40,540,cobalt,'p1 cobalt rows');
  await rows('01-hook.png',180,760,40,540,ink,'p1 ink rows');
  await rows('05-result.png',560,1100,50,1000,bone,'p5 bone rows');
})();
