const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1200,height:900}});
 await p.goto('file:///C:/Users/Vina/Documents/Default%20Project/carousel-proposal/wireframes.html?mode=slides',{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);
 console.log(await p.evaluate(()=>({
   serif:document.fonts.check('16px "DM Serif Display"'),
   sans:document.fonts.check('16px "Plus Jakarta Sans"'),
   fonts:[...document.fonts].map(f=>({family:f.family,weight:f.weight,style:f.style,status:f.status})).slice(0,10),
   over:[...document.querySelectorAll('.slide')].flatMap((s,i)=>[...s.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+2 && getComputedStyle(e).overflow==='visible').map(e=>({slide:i+1,cls:e.className,tag:e.tagName,sw:e.scrollWidth,cw:e.clientWidth,text:(e.textContent||'').trim().slice(0,40)})))
 })));
 // exact boxes for slide 1 + 6 problem zones
 console.log(await p.evaluate(()=>{
   const out={};
   const s1=document.querySelectorAll('.slide')[0];
   out.s1={support:s1.querySelector('.support').getBoundingClientRect().toJSON(), note:s1.querySelector('.photo-note').getBoundingClientRect().toJSON(), notifwrap:s1.querySelector('.abs[style*="1012"]').getBoundingClientRect().toJSON(), img:s1.querySelector('.notif').getBoundingClientRect().toJSON(),headline:s1.querySelector('.abs[style*="196"]').getBoundingClientRect().toJSON()};
   const s6=document.querySelectorAll('.slide')[5];
   out.s6={headline:s6.querySelector('.headline').getBoundingClientRect().toJSON(),notif:s6.querySelector('.notif2').getBoundingClientRect().toJSON(),support:s6.querySelector('.support').getBoundingClientRect().toJSON(),heart:s6.querySelector('.heart').getBoundingClientRect().toJSON()};
   return out;
 }));
 await b.close();
})();
