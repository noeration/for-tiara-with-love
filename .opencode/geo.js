const { chromium } = require('playwright');
const path=require('path');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file:///C:/Users/Vina/Documents/Default%20Project/carousel-proposal/wireframes.html?mode=overview',{waitUntil:'networkidle'});
 console.log(await p.evaluate(()=>{
   const g=document.querySelector('.grid');
   return {body:{w:document.body.scrollWidth,h:document.body.scrollHeight},grid:g.getBoundingClientRect().toJSON(), cards:[...document.querySelectorAll('.card')].map(c=>({top:c.getBoundingClientRect().top,left:c.getBoundingClientRect().left,w:c.getBoundingClientRect().width,h:c.getBoundingClientRect().height, frame:c.querySelector('.frame').getBoundingClientRect().toJSON(), slide:c.querySelector('.slide').getBoundingClientRect().toJSON()}))
   };
 }));
 await b.close();
})();
