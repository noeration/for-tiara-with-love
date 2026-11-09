const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async()=>{
  const dir = 'C:/Users/Vina/Documents/Default Project/carousel-proposal';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{width:1600,height:1200}, deviceScaleFactor:2 });
  const url = 'file:///' + path.join(dir,'wireframes.html').replace(/\\/g,'/');

  await page.goto(url + '?mode=overview', { waitUntil:'networkidle' });
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(dir,'wireframes-overview.png'), fullPage:true });

  await page.goto(url + '?mode=slides', { waitUntil:'networkidle' });
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(800);

  const cards = await page.locator('.card').all();
  for (const card of cards) {
    const no = await card.getAttribute('data-no');
    await card.locator('.frame').screenshot({ path: path.join(dir, `wireframe-${no}.png`) });
  }

  // overflow / clipping report
  const report = await page.evaluate(()=>{
    const out=[];
    document.querySelectorAll('.slide').forEach((slide,idx)=>{
      const sr=slide.getBoundingClientRect();
      slide.querySelectorAll('*').forEach(el=>{
        const r=el.getBoundingClientRect();
        if(r.width===0||r.height===0) return;
        if(r.left<sr.left-1||r.top<sr.top-1||r.right>sr.right+1||r.bottom>sr.bottom+1){
          out.push({slide:idx+1, el:el.className||el.tagName, left:Math.round(r.left-sr.left), top:Math.round(r.top-sr.top), right:Math.round(r.right-sr.left), bottom:Math.round(r.bottom-sr.top)});
        }
        if(el.scrollHeight>el.clientHeight+2 && getComputedStyle(el).overflow==='hidden'){
          out.push({slide:idx+1, el:'CLIPPED '+(el.className||el.tagName), sh:el.scrollHeight, ch:el.clientHeight});
        }
      });
    });
    return out;
  });
  console.log(JSON.stringify(report,null,2));
  console.log('overview size', (await page.evaluate(()=>({w:document.body.scrollWidth,h:document.body.scrollHeight}))));
  await browser.close();
})();
