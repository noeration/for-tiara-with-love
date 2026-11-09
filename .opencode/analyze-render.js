const sharp = require('sharp');
const dir = 'C:/Users/Vina/Documents/Default Project/carousel-proposal/render';

function components(w, h, isFg) {
  const seen = new Uint8Array(w * h);
  const out = [];
  const stack = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const idx = y * w + x;
    if (seen[idx] || !isFg(idx)) continue;
    let minX = x, maxX = x, minY = y, maxY = y, n = 0;
    stack.push(idx); seen[idx] = 1;
    while (stack.length) {
      const c = stack.pop(); n++;
      const cy = (c / w) | 0, cx = c % w;
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
      const nb = [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]];
      for (const [nx, ny] of nb) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (!seen[ni] && isFg(ni)) { seen[ni] = 1; stack.push(ni); }
      }
    }
    if (n > 60) out.push({ n, minX, minY, maxX, maxY, w: maxX-minX+1, h: maxY-minY+1 });
  }
  return out.sort((a,b)=>b.n-a.n).slice(0,12);
}

(async () => {
  for (const f of ['p1','p6']) {
    const { data, info } = await sharp(dir + '/' + f + '.png').raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: ch } = info;
    const dark = i => { const o = i*ch; return data[o] < 45 && data[o+1] < 47 && data[o+2] < 55; };
    console.log(f, 'DARK COMPONENTS');
    console.log(JSON.stringify(components(w,h,dark)));
  }
})();
