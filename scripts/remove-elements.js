// Removes the cyan arrow graphic and the baked "{ REPLACE: Year }" placeholder
// from creative-1.png, reconstructing the dark background by float-precision
// diffusion from the surrounding pixels. Everything else is untouched.
// Idempotent: always restores from backup before processing.
const path = require('path');
const fs = require('fs');
const { Jimp } = require('jimp');

const SRC = path.join(process.cwd(), 'assets/img/creative-1.png');
const BACKUP = path.join(process.cwd(), 'backups', 'creative-1-original.png');

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
  if (fs.existsSync(BACKUP)) fs.copyFileSync(BACKUP, SRC);
  else fs.copyFileSync(SRC, BACKUP);

  const img = await Jimp.read(SRC);
  const W = img.bitmap.width, H = img.bitmap.height, d = img.bitmap.data;

  const mask = new Uint8Array(W * H);
  let aN = 0, tN = 0;
  for (let y = 670; y <= 750; y++) for (let x = 90; x <= 210; x++) {
    const i = (y * W + x) * 4, r = d[i], g = d[i + 1], b = d[i + 2];
    if ((b > 120 && b - r > 60 && g > 90) || (r + g + b) / 3 > 24) { mask[y * W + x] = 1; aN++; }
  }
  for (let y = 778; y <= 830; y++) for (let x = 92; x <= 372; x++) {
    const i = (y * W + x) * 4;
    if ((d[i] + d[i + 1] + d[i + 2]) / 3 > 22) { mask[y * W + x] = 1; tN++; }
  }
  console.log('arrow mask px:', aN, '| text mask px:', tN);
  if (aN < 300 || tN < 800) { console.error('detection failed'); process.exit(1); }

  const m = dilate(mask, W, H, 4);
  let mn = 0; for (let i = 0; i < m.length; i++) if (m[i]) mn++;
  console.log('dilated mask px:', mn);

  // float channels (avoids integer-quantization stall)
  const fr = new Float64Array(W * H), fg = new Float64Array(W * H), fb = new Float64Array(W * H);
  for (let k = 0; k < W * H; k++) {
    fr[k] = d[k * 4]; fg[k] = d[k * 4 + 1]; fb[k] = d[k * 4 + 2];
  }

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
      for (let y = 778; y <= 830; y++) for (let x = 92; x <= 372; x++) {
        const k = y * W + x; if (m[k]) { s += (fr[k] + fg[k] + fb[k]) / 3; n++; }
      }
      const mean = s / n;
      if (iter % 300 === 0 || Math.abs(mean - prevMean) < 0.05) console.log('iter', iter, 'fill mean:', mean.toFixed(2));
      if (Math.abs(mean - prevMean) < 0.05 && mean < 15) { console.log('converged at', iter); break; }
      prevMean = mean;
    }
  }

  // write back masked px only
  for (let k = 0; k < W * H; k++) {
    if (!m[k]) continue;
    d[k * 4] = Math.max(0, Math.min(255, Math.round(fr[k])));
    d[k * 4 + 1] = Math.max(0, Math.min(255, Math.round(fg[k])));
    d[k * 4 + 2] = Math.max(0, Math.min(255, Math.round(fb[k])));
  }

  // verify: fill vs surrounding, boundary continuity, no leftovers
  let fill = 0, fn = 0, ring = 0, rn = 0, bMax = 0;
  for (let y = 770; y <= 838; y++) for (let x = 84; x <= 380; x++) {
    const k = y * W + x, i = k * 4;
    const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
    if (m[k]) { fill += lum; fn++; } else { ring += lum; rn++; }
    if (m[k] && (x > 0 && x < W - 1 && y > 0 && y < H - 1) && (!m[k - 1] || !m[k + 1] || !m[k - W] || !m[k + W])) {
      for (const j of [k - 1, k + 1, k - W, k + W]) {
        if (!m[j]) {
          const diff = Math.max(Math.abs(d[i] - d[j * 4]), Math.abs(d[i + 1] - d[j * 4 + 1]), Math.abs(d[i + 2] - d[j * 4 + 2]));
          if (diff > bMax) bMax = diff;
        }
      }
    }
  }
  console.log('text fill mean:', (fill / fn).toFixed(1), '| ring mean:', (ring / rn).toFixed(1), '| boundary max diff:', bMax);

  await img.write(SRC);
  const chk = await Jimp.read(SRC); const c = chk.bitmap.data;
  let bad1 = 0, bad2 = 0;
  for (let y = 670; y <= 750; y++) for (let x = 90; x <= 210; x++) {
    const i = (y * W + x) * 4; if ((c[i] + c[i + 1] + c[i + 2]) / 3 > 70) bad1++;
  }
  for (let y = 778; y <= 830; y++) for (let x = 92; x <= 372; x++) {
    const i = (y * W + x) * 4; if ((c[i] + c[i + 1] + c[i + 2]) / 3 > 70) bad2++;
  }
  console.log('remaining lum>70 — arrow window:', bad1, '| text window:', bad2, '| dims:', chk.bitmap.width + 'x' + chk.bitmap.height);
})().catch((e) => { console.error(e); process.exit(1); });
