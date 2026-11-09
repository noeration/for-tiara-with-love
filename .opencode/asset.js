const sharp = require('sharp');
const p = 'C:/Users/Vina/Downloads/project carousel/asset/notification pop out.png';
(async()=>{
  const meta = await sharp(p).metadata();
  const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let minX=info.width,minY=info.height,maxX=0,maxY=0,count=0;
  const colors = new Map();
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    const i=(y*info.width+x)*4; const a=data[i+3];
    if(a>25){count++; if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y;
      const key=[data[i]>>4<<4,data[i+1]>>4<<4,data[i+2]>>4<<4].join(',');
      colors.set(key,(colors.get(key)||0)+1);
    }
  }
  console.log('size',info.width,info.height,'alpha bbox',minX,minY,maxX,maxY,'opaque px',count, 'coverage', (count/(info.width*info.height)*100).toFixed(1)+'%');
  const top=[...colors.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12);
  console.log(top.map(([k,v])=>{const [r,g,b]=k.split(',').map(Number);return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')+' '+v}).join('\n'));
  // opaque bbox coarse mosaic
  const w=24,h=10;
  const buf = await sharp(p).extract({left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1}).resize(w,h,{fit:'fill'}).flatten({background:'#00ff00'}).raw().toBuffer();
  for(let y=0;y<h;y++){let row=[];for(let x=0;x<w;x++){const i=(y*w+x)*3;row.push('#'+[buf[i],buf[i+1],buf[i+2]].map(v=>v.toString(16).padStart(2,'0')).join(''));}console.log(row.join(' '));}
})();
