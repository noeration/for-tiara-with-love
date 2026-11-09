const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1200,height:900}});
 await p.goto('file:///C:/Users/Vina/Documents/Default%20Project/carousel-proposal/wireframes.html?mode=slides',{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);
 const out = await p.evaluate(()=>{
   const slides=[...document.querySelectorAll('.slide')];
   function lineBoxes(el){
     const range=document.createRange(); const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
     const chars=[]; let n;
     while(n=walker.nextNode()){
       const t=n; const s=t.textContent;
       for(let i=0;i<s.length;i++){ range.setStart(t,i); range.setEnd(t,i+1); const r=range.getBoundingClientRect(); if(r.width||r.height) chars.push({c:s[i],x:r.x,y:r.y,w:r.width,h:r.height,top:r.top,bottom:r.bottom}); }
     }
     const rows=[];
     for(const q of chars){ let row=rows.find(r=>Math.abs(r.y-q.y)<q.h*0.45); if(!row){row={y:q.y,top:q.top,bottom:q.bottom,text:''};rows.push(row);} row.text+=q.c; row.top=Math.min(row.top,q.top); row.bottom=Math.max(row.bottom,q.bottom);}
     return rows.map(r=>({text:r.text.trim(),top:Math.round(r.top),bottom:Math.round(r.bottom)})).filter(r=>r.text);
   }
   const s6=slides[5];
   return {
     s6head:lineBoxes(s6.querySelector('.headline')),
     s6support:lineBoxes(s6.querySelector('.support')),
     s2closing:lineBoxes(slides[1].querySelector('.closing')),
     s5quote:lineBoxes(slides[4].querySelector('.quote')),
     s4head:lineBoxes(slides[3].querySelector('.headline'))
   };
 });
 console.log(JSON.stringify(out,null,2));
 await b.close();
})();
