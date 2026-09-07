const path = require('path');
const fs = require('fs');
const mod = require('jimp');
const Jimp = mod.Jimp || mod;

(async () => {
  const src = 'assets/img/gaming-banner.png';
  const img = await Jimp.read(src);
  const W = img.bitmap.width, H = img.bitmap.height;
  const cols = 3, rows = 2;
  const xs = [], ys = [];
  for (let c = 0; c <= cols; c++) xs.push(Math.round((c / cols) * W));
  for (let r = 0; r <= rows; r++) ys.push(Math.round((r / rows) * H));
  const outDir = 'assets/img';
  let n = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = xs[c], y = ys[r];
      const w = xs[c + 1] - x, h = ys[r + 1] - y;
      const tile = img.clone().crop({ x, y, w, h });
      const file = path.join(outDir, 'gaming-' + n + '.png');
      await tile.write(file);
      console.log('saved', file, w + 'x' + h);
      n++;
    }
  }
})().catch(e => { console.error(e); process.exit(1); });
