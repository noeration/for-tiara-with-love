const sharp = require('sharp');
const fs = require('fs');
const dir = 'C:/Users/Vina/Documents/Default Project/carousel-final';
const files = ['01-hook.png','02-problem.png','03-mind-reading.png','04-solution.png','05-result.png','06-cta.png'];

async function darkBox(file, box) {
  const { data, info } = await sharp(dir+'/'+file).extract(box).raw().toBuffer({resolveWithObject:true});
  let minX=1e9,minY=1e9,maxX=-1,maxY=-1,n=0;
  for (let y=0;y<info.height;y++) for (let x=0;x<info.width;x++){
    const i=(y*info.width+x)*info.channels;
    if (data[i]<60 && data[i+1]<62 && data[i+2]<75) { n++; if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; }
  }
  return n? {x:box.left+minX,y:box.top+minY,w:maxX-minX+1,h:maxY-minY+1,px:n}:null;
}

(async () => {
  for (const f of files) {
    const m = await sharp(dir+'/'+f).metadata();
    console.log(f, m.width + 'x' + m.height);
  }
  console.log('p1 notif dark', JSON.stringify(await darkBox('01-hook.png', {left:440,top:930,width:600,height:180})));
  console.log('p6 notif dark', JSON.stringify(await darkBox('06-cta.png', {left:440,top:940,width:600,height:180})));

  // contact sheet 2 x 3
  const W = 540, H = 675, G = 32, cols = 2, rows = 3;
  const sheetW = cols*W + (cols+1)*G;
  const sheetH = rows*H + (rows+1)*G;
  const composites = [];
  for (let i=0;i<files.length;i++){
    const buf = await sharp(dir+'/'+files[i]).resize(W,H).toBuffer();
    const c = i % cols, r = Math.floor(i/cols);
    composites.push({ input: buf, left: G + c*(W+G), top: G + r*(H+G) });
  }
  await sharp({ create: { width: sheetW, height: sheetH, channels: 3, background: '#14151B' } })
    .composite(composites)
    .png()
    .toFile(dir + '/preview.png');
  console.log('preview', sheetW + 'x' + sheetH);
})();
