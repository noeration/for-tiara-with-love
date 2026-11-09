const sharp = require('sharp');
(async () => {
  const f = 'C:/Users/Vina/Documents/Default Project/carousel-final/cta-new.png';
  const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
  let minX=1e9,minY=1e9,maxX=-1,maxY=-1,n=0;
  for (let y=860;y<1200;y++) for (let x=430;x<1060;x++){
    const i=(y*info.width+x)*info.channels;
    if (data[i]<70 && data[i+1]<72 && data[i+2]<85){ n++; if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; }
  }
  console.log('notif dark bbox', {x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,px:n});
  // empty check: area between headline bottom and support line
  let ink=0;
  for (let y=300;y<630;y++) for (let x=60;x<1020;x++){
    const i=(y*info.width+x)*info.channels;
    if (data[i]<120 && data[i+1]<120 && data[i+2]<140) ink++;
  }
  console.log('ink px 300-630', ink);
})();
