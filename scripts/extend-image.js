// Seamlessly extends creative-2.png upward (outpaint) to fill the card's black band.
// The extension continues the dark premium wall upward with a gentle vertical
// darkening fade and softened horizontal detail, blending byte-exact at the seam.
const path = require('path');
const fs = require('fs');
const { Jimp } = require('jimp');

const SRC = path.join(process.cwd(), 'assets/img/creative-2.png');
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const BACKUP = path.join(BACKUP_DIR, 'creative-2-original.png');
const EXT = 390; // 940 -> 1330 (factor 1.415, matches 7/5 grid span ratio)

(async () => {
  const img = await Jimp.read(SRC);
  const W = img.bitmap.width;
  const H = img.bitmap.height;
  const src = img.bitmap.data;
  console.log('source:', W + 'x' + H);

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  if (!fs.existsSync(BACKUP)) {
    fs.copyFileSync(SRC, BACKUP);
    console.log('backup ->', BACKUP);
  } else {
    console.log('backup already exists:', BACKUP);
  }

  // base color per column: blend of row0 and a horizontally blurred row0
  const blurR = 22;
  const base = new Float32Array(W * 3);
  for (let x = 0; x < W; x++) {
    for (let ch = 0; ch < 3; ch++) {
      let acc = 0, n = 0;
      for (let k = -blurR; k <= blurR; k++) {
        const xx = Math.min(W - 1, Math.max(0, x + k));
        acc += src[(0 * W + xx) * 4 + ch];
        n++;
      }
      const blurred = acc / n;
      const row0 = src[x * 4 + ch];
      base[x * 3 + ch] = 0.45 * row0 + 0.55 * blurred;
    }
  }

  const H2 = H + EXT;
  const out = new Jimp({ width: W, height: H2, color: 0x000000ff });
  const dst = out.bitmap.data;

  // deterministic noise
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (let y = 0; y < EXT; y++) {
    const t = y / (EXT - 1); // 0 = top of frame, 1 = seam row
    const dark = 0.55 + 0.45 * t;
    const baseW = (1 - t) * 0.6;
    const noiseAmp = 3.0 * (1 - t) * (1 - t);
    for (let x = 0; x < W; x++) {
      const di = (y * W + x) * 4;
      const si = x * 4;
      for (let ch = 0; ch < 3; ch++) {
        const row0 = src[si + ch];
        const v = row0 * dark + (base[x * 3 + ch] - row0) * baseW + (rand() - 0.5) * noiseAmp;
        dst[di + ch] = Math.max(0, Math.min(255, Math.round(v)));
      }
      dst[di + 3] = 255;
    }
  }
  // force the seam row to be a byte-exact copy of the original row 0
  for (let x = 0; x < W; x++) {
    const di = ((EXT - 1) * W + x) * 4;
    const si = x * 4;
    dst[di] = src[si];
    dst[di + 1] = src[si + 1];
    dst[di + 2] = src[si + 2];
    dst[di + 3] = src[si + 3];
  }
  // copy the original image below the extension
  for (let y = 0; y < H; y++) {
    const from = y * W * 4;
    dst.set(src.subarray(from, from + W * 4), (EXT + y) * W * 4);
  }

  await out.write(SRC);
  console.log('written:', SRC, W + 'x' + H2);

  // verify seam continuity
  const check = await Jimp.read(SRC);
  const c = check.bitmap.data;
  let seamMax = 0;
  for (let x = 0; x < W; x++) {
    const a = ((EXT - 1) * W + x) * 4;
    const b = (EXT * W + x) * 4;
    for (let ch = 0; ch < 3; ch++) seamMax = Math.max(seamMax, Math.abs(c[a + ch] - c[b + ch]));
  }
  // verify original content preserved below seam (compare against backup)
  const orig = await Jimp.read(BACKUP);
  let origMax = 0;
  for (let y = 0; y < H; y += 37) {
    for (let x = 0; x < W; x += 11) {
      const ci = ((EXT + y) * W + x) * 4;
      const oi = (y * W + x) * 4;
      for (let ch = 0; ch < 3; ch++) origMax = Math.max(origMax, Math.abs(c[ci + ch] - orig.bitmap.data[oi + ch]));
    }
  }
  console.log('seam max channel diff (row above vs original row0):', seamMax);
  console.log('original lower section max diff vs backup (sampled):', origMax);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
