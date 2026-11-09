const sharp = require('sharp');
(async()=>{
  const f='C:/Users/Vina/Documents/Default Project/carousel-final/check1.png';
  const {data,info}=await sharp(f).raw().toBuffer({resolveWithObject:true});
  const rows=[];
  for(let y=380;y<1200;y++){
    let n=0;
    for(let x=430;x<1060;x++){
      const i=(y*info.width+x)*info.channels;
      if(data[i]<60&&data[i+1]<62&&data[i+2]<75) n++;
    }
    if(n>5) rows.push([y,n]);
  }
  console.log('dark rows', rows.length? rows[0][0]+'-'+rows[rows.length-1][0] : 'none');
  const mid=rows.filter(r=>r[1]>300).map(r=>r[0]);
  console.log('wide dark rows', mid.length? mid[0]+'-'+mid[mid.length-1]+' count='+mid.length : 'none');
})();
