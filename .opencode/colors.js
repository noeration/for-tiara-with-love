const sharp = require('sharp');
const asset = 'C:/Users/Vina/Downloads/project carousel/asset/notification pop out.png';
const dir = 'C:/Users/Vina/Documents/Default Project/carousel-proposal/render';

(async () => {
  // asset alpha bbox
  const { data, info } = await sharp(asset).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX=1e9,minY=1e9,maxX=-1,maxY=-1;
  for (let y=0;y<info.height;y++) for (let x=0;x<info.width;x++){
    const a = data[(y*info.width+x)*4+3];
    if (a>16){ if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; }
  }
  console.log('asset', info.width+'x'+info.height, 'opaque bbox', {minX,minY,maxX,maxY,w:maxX-minX+1,h:maxY-minY+1}, 'aspect', ((maxX-minX+1)/(maxY-minY+1)).toFixed(3));

  for (const f of ['p1','p3','p6']) {
    const { data:d, info:i } = await sharp(dir+'/'+f+'.png').raw().toBuffer({ resolveWithObject: true });
    const counts = new Map();
    for (let p=0;p<i.width*i.height;p++){
      const r=d[p*i.channels], g=d[p*i.channels+1], b=d[p*i.channels+2];
      const k=[r>>4<<4,g>>4<<4,b>>4<<4].join(',');
      counts.set(k,(counts.get(k)||0)+1);
    }
    const top=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6);
    console.log(f, i.width+'x'+i.height, top);
  }
})();
