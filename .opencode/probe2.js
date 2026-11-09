const sharp = require('sharp');
const dir = 'C:/Users/Vina/Documents/Default Project/carousel-final';
async function probe(file, box, label) {
  const { data, info } = await sharp(dir+'/'+file).extract(box).raw().toBuffer({resolveWithObject:true});
  const counts = new Map();
  for (let i=0;i<info.width*info.height;i++){
    const k=[data[i*info.channels],data[i*info.channels+1],data[i*info.channels+2]].join(',');
    counts.set(k,(counts.get(k)||0)+1);
  }
  const top=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
  console.log(label, box, top);
}
(async()=>{
  await probe('05-result.png', {left:60,top:700,width:300,height:230}, 'p5 quote oh line');
  await probe('05-result.png', {left:300,top:700,width:300,height:230}, 'p5 right of oh');
  await probe('04-solution.png', {left:660,top:1080,width:300,height:60}, 'p4 asumsi line');
  await probe('03-mind-reading.png', {left:590,top:1160,width:260,height:60}, 'p3 legend area');
  await probe('01-hook.png', {left:440,top:940,width:600,height:180}, 'p1 notif area');
})();
