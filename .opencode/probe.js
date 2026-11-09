const sharp = require('sharp');
const dir = 'C:/Users/Vina/Documents/Default Project/carousel-proposal/render';
const S = 480/1080;
const probes = [
  ['p1', { l:469, t:911, w:585, h:271 }, 'p1 notification block'],
  ['p1', { l:503, t:1001, w:84, h:92 }, 'p1 avatar'],
  ['p6', { l:650, t:186, w:368, h:333 }, 'p6 top-right block'],
  ['p6', { l:65, t:712, w:951, h:190 }, 'p6 composer'],
];
(async () => {
  for (const [f, b, label] of probes) {
    const left = Math.round(b.l*S), top = Math.round(b.t*S), width = Math.round(b.w*S), height = Math.round(b.h*S);
    const { data, info } = await sharp(dir+'/'+f+'.png').extract({left,top,width,height}).raw().toBuffer({resolveWithObject:true});
    let n=0, r=0,g=0,bb=0, dark=0;
    for (let i=0;i<info.width*info.height;i++){
      const R=data[i*info.channels],G=data[i*info.channels+1],B=data[i*info.channels+2];
      r+=R; g+=G; bb+=B; n++;
      if (R<60&&G<60&&B<70) dark++;
    }
    console.log(label, {mean:[Math.round(r/n),Math.round(g/n),Math.round(bb/n)], darkPct:+(100*dark/n).toFixed(1), size:info.width+'x'+info.height});
  }
})();
