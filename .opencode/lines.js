const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1200,height:900}});
 await p.goto('file:///C:/Users/Vina/Documents/Default%20Project/carousel-proposal/wireframes.html?mode=slides',{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);
 const out = await p.evaluate(()=>{
   function lines(el){
     const r=document.createRange(); const t=el.firstChild; const res=[];
     if(!t||t.nodeType!==3) return '';
     const s=t.textContent;
     for(let i=0;i<s.length;i++){r.setStart(t,i);r.setEnd(t,i+1);const b=r.getBoundingClientRect();res.push({c:s[i],x:Math.round(b.x),y:Math.round(b.y)});}
     const groups=[]; let cur=null;
     for(const q of res){ if(!cur||q.y!==cur.y){cur={y:q.y,text:''};groups.push(cur);} cur.text+=q.c; }
     return groups.map(g=>g.text.trim()).filter(Boolean);
   }
   const slides=[...document.querySelectorAll('.slide')];
   const s3=slides[2], s6=slides[5], s1=slides[0];
   return {
     s3:{lede:lines(s3.querySelector('.lede')),term:lines(s3.querySelector('.term')),copy:[...s3.querySelectorAll('.copy')].map(lines),body:s3.querySelector('.abs[style*="556"]').getBoundingClientRect().toJSON(),fact:s3.querySelector('.fact').getBoundingClientRect().toJSON(),ass:s3.querySelector('.assumption').getBoundingClientRect().toJSON(),legend:s3.querySelector('.legend').getBoundingClientRect().toJSON()},
     s6:{headline:lines(s6.querySelector('.headline')),support:lines(s6.querySelector('.support'))},
     s1:{support:lines(s1.querySelector('.support')),notif:s1.querySelector('.notif').getBoundingClientRect().toJSON(),note:s1.querySelector('.photo-note').getBoundingClientRect().toJSON()}
   };
 });
 console.log(JSON.stringify(out,null,2));
 await b.close();
})();
