// Removes decorative arrow graphics (and the baked year placeholder) from the
// creative card images, reconstructing the dark background by float-precision
// diffusion from surrounding pixels. Everything else is untouched.
// Idempotent: each job restores from its backup before processing.
const path = require('path');
const fs = require('fs');
const { Jimp } = require('jimp');

const JOBS = [
  {
    src: 'assets/img/creative-1.png',
    backup: 'backups/creative-1-original.png',
    regions: [
      // cyan arrow between VISUAL DESIGN and title
      { x0: 90, x1: 210, y0: 670, y1: 750, minInk: 300, test: (r, g, b) => (b > 120 && b - r > 60 && g > 90) || (r + g + b) / 3 > 24 },
      // baked "{ REPLACE: Year }" under the title
      { x0: 92, x1: 372, y0: 778, y1: 830, minInk: 800, test: (r, g, b) => (r + g + b) / 3 > 22 },
    ],
  },
  {
    src: 'assets/img/creative-2.png',
    backup: 'backups/creative-2-with-arrow.png',
    regions: [
      // purple arrow left of BRANDING
      { x0: 85, x1: 165, y0: 1048, y1: 1128, minInk: 300, test: (r, g, b) => (r + g + b) / 3 > 50 },
    ],
  },
];

const dilate = (m, W, H, r) => {
  const out = new Uint8Array(m);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!m[y * W + x]) continue;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy >= 0 && yy < H && xx >= 0 && xx < W) out[yy * W + xx] = 1;
    }
  }
  return out;
};

(async () => {
  for (const job of JOBS) {
    const SRC = path.join(process.cwd(), job.src);
    const BACKUP = path.join(process.cwd(), job.backup);
    if (fs.existsSync(BACKUP)) fs.copyFileSync(BACKUP, SRC);
    else fs.copyFileSync(SRC, BACKUP);

    const img = await Jimp.read(SRC);
    const W = img.bitmap.width, H = img.bitmap.height, d = img.bitmap.data;

    const mask = new Uint8Array(W * H);
    let total = 0;
    for (const reg of job.regions) {
      let n = 0;
      for (let y = reg.y0; y <= reg.y1; y++) for (let x = reg.x0; x <= reg.x1; x++) {
        const i = (y * W + x) * 4;
        if (reg.test(d[i], d[i + 1], d[i + 2])) { mask[y * W + x] = 1; n++; }
      }
      console.log(job.src, 'region', reg.x0 + '-' + reg.x1, reg.y0 + '-' + reg.y1, 'ink px:', n);
      if (n < reg.minInk) { console.error('detection failed'); process.exit(1); }
      total += n;
    }

    const m = dilate(mask, W, H, 4);
    const fr = new Float64Array(W * H), fg = new Float64Array(W * H), fb = new Float64Array(W * H);
    for (let k = 0; k < W * H; k++) { fr[k] = d[k * 4]; fg[k] = d[k * 4 + 1]; fb[k] = d[k * 4 + 2]; }

    let prevMean = -1;
    for (let iter = 1; iter <= 1500; iter++) {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const k = y * W + x;
        if (!m[k]) continue;
        let sr = 0, sg = 0, sb = 0, c = 0;
        if (x > 0) { sr += fr[k - 1]; sg += fg[k - 1]; sb += fb[k - 1]; c++; }
        if (x < W - 1) { sr += fr[k + 1]; sg += fg[k + 1]; sb += fb[k + 1]; c++; }
        if (y > 0) { sr += fr[k - W]; sg += fg[k - W]; sb += fb[k - W]; c++; }
        if (y < H - 1) { sr += fr[k + W]; sg += fg[k + W]; sb += fb[k + W]; c++; }
        fr[k] = sr / c; fg[k] = sg / c; fb[k] = sb / c;
      }
      if (iter % 100 === 0) {
        let s = 0, n = 0;
        for (const reg of job.regions) for (let y = reg.y0; y <= reg.y1; y++) for (let x = reg.x0; x <= reg.x1; x++) {
          const k = y * W + x; if (m[k]) { s += (fr[k] + fg[k] + fb[k]) / 3; n++; }
        }
        const mean = s / n;
        if (iter % 300 === 0 || Math.abs(mean - prevMean) < 0.05) console.log('iter', iter, 'fill mean:', mean.toFixed(2));
        if (Math.abs(mean - prevMean) < 0.05 && mean < 15) { console.log('converged at', iter); break; }
        prevMean = mean;
      }
    }

    for (let k = 0; k < W * H; k++) {
      if (!m[k]) continue;
      d[k * 4] = Math.max(0, Math.min(255, Math.round(fr[k])));
      d[k * 4 + 1] = Math.max(0, Math.min(255, Math.round(fg[k])));
      d[k * 4 + 2] = Math.max(0, Math.min(255, Math.round(fb[k])));
    }

    await img.write(SRC);

    // verify: no leftovers above the dark-wall level in each region
    const chk = await Jimp.read(SRC); const c = chk.bitmap.data;
    let bad = 0, fill = 0, fn = 0, ring = 0, rn = 0;
    for (const reg of job.regions) {
      for (let y = reg.y0; y <= reg.y1; y++) for (let x = reg.x0; x <= reg.x1; x++) {
        const i = (y * W + x) * 4, lum = (c[i] + c[i + 1] + c[i + 2]) / 3;
        if (lum > 70) bad++;
      }
      for (let y = reg.y0 - 20; y <= reg.y1 + 20; y++) for (let x = reg.x0 - 20; x <= reg.x1 + 20; x++) {
        if (y < 0 || y >= H || x < 0 || x >= W) continue;
        const k = y * W + x, i = k * 4;
        const lum = (c[i] + c[i + 1] + c[i + 2]) / 3;
        if (m[k]) { fill += lum; fn++; } else { ring += lum; rn++; }
      }
    }
    console.log(job.src, 'DONE — remaining lum>70:', bad, '| fill mean:', (fill / fn).toFixed(1), '| ring mean:', (ring / rn).toFixed(1), '| dims:', chk.bitmap.width + 'x' + chk.bitmap.height);
  }
})().catch((e) => { console.error(e); process.exit(1); });
