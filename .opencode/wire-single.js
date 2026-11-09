const sharp = require('sharp');
const fs = require('fs');
const src = 'C:/Users/Vina/Documents/Default Project/carousel-proposal';
const out = src + '/wireframes-single';
fs.mkdirSync(out, { recursive: true });
const names = ['01-hook','02-problem','03-mind-reading','04-solution','05-result','06-cta'];
(async () => {
  for (let i = 0; i < 6; i++) {
    const n = String(i+1).padStart(2,'0');
    const file = `${src}/wireframe-${n}.png`;
    const m = await sharp(file).metadata();
    await sharp(file).resize(1080, 1350).png().toFile(`${out}/${names[i]}.png`);
    console.log(names[i], m.width + 'x' + m.height, '-> 1080x1350');
  }
})();
