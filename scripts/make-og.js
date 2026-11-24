/* =============================================================================
   NOVA — OG COVER GENERATOR
   Creates assets/img/og-cover.png (1200x630) with jimp.
   Look: black background, bold geometric N monogram in accent red.
   Run: node scripts/make-og.js
============================================================================= */
const { Jimp, loadFont } = require("jimp");
const path = require("path");

const W = 1200, H = 630;
const OUT = path.join(__dirname, "..", "assets", "img", "og-cover.png");
const FONT_DIR = path.join(
  __dirname, "..", "node_modules", "@jimp", "plugin-print", "fonts", "open-sans"
);

const BLACK = { r: 4, g: 4, b: 5 };         // near-black ground
const ACCENT = { r: 255, g: 77, b: 46 };    // #FF4D2E — the red
const DEEPRED = { r: 150, g: 32, b: 18 };   // dark red ambient

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function blend(img, x, y, color, alpha) {
  if (alpha <= 0.003) return;
  const idx = (img.bitmap.width * y + x) << 2;
  const d = img.bitmap.data;
  alpha = clamp(alpha, 0, 1);
  d[idx] = d[idx] * (1 - alpha) + color.r * alpha;
  d[idx + 1] = d[idx + 1] * (1 - alpha) + color.g * alpha;
  d[idx + 2] = d[idx + 2] * (1 - alpha) + color.b * alpha;
  d[idx + 3] = 255;
}

(async () => {
  const img = new Jimp({ width: W, height: H, color: 0x040405ff });

  // solid black ground (very slight lift toward the centre)
  const d = img.bitmap.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (W * y + x) << 2;
      const cx = (x - W / 2) / (W / 2), cy = (y - H / 2) / (H / 2);
      const lift = Math.max(0, 1 - (cx * cx + cy * cy)) * 8;
      d[idx] = 4 + lift;
      d[idx + 1] = 4 + lift;
      d[idx + 2] = 5 + lift;
      d[idx + 3] = 255;
    }
  }

  // faint dark-red halo behind the monogram — keeps the black from going flat
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = (x - W * 0.5) / (W * 0.34), dy = (y - H * 0.46) / (H * 0.62);
      const a = Math.max(0, 1 - (dx * dx + dy * dy)) * 0.30;
      blend(img, x, y, DEEPRED, a);
    }
  }

  // geometric N monogram — centred, thick red strokes
  const nw = 340, nh = 360, t = 46;
  const nx = Math.round((W - nw) / 2), ny = Math.round(H * 0.46 - nh / 2);

  function seg(x1, y1, x2, y2) {
    const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1)) * 2;
    for (let s = 0; s <= steps; s++) {
      const px = x1 + ((x2 - x1) * s) / steps;
      const py = y1 + ((y2 - y1) * s) / steps;
      for (let oy = -t / 2; oy <= t / 2; oy++) {
        for (let ox = -t / 2; ox <= t / 2; ox++) {
          const X = Math.round(px + ox), Y = Math.round(py + oy);
          if (X >= 0 && X < W && Y >= 0 && Y < H) blend(img, X, Y, ACCENT, 1);
        }
      }
    }
  }
  seg(nx, ny + nh, nx, ny);           // left stem
  seg(nx, ny, nx + nw, ny + nh);      // diagonal
  seg(nx + nw, ny + nh, nx + nw, ny); // right stem

  // wordmark + url — print on a transparent scratch, measure ink, centre exactly
  try {
    const f64 = await loadFont(path.join(FONT_DIR, "open-sans-64-white", "open-sans-64-white.fnt"));
    const f16 = await loadFont(path.join(FONT_DIR, "open-sans-16-white", "open-sans-16-white.fnt"));

    // returns {w, h, minX, minY} of non-transparent ink
    function inkBox(buf, w, h) {
      let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (buf[((w * y + x) << 2) + 3] > 8) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < 0) return null;
      return { w: maxX - minX + 1, h: maxY - minY + 1, minX: minX, minY: minY };
    }

    async function placeCentered(text, font, topY) {
      const SW = 1200, SH = 300;
      const scratch = new Jimp({ width: SW, height: SH, color: 0x00000000 });
      await scratch.print({ font: font, x: 0, y: 0, text: text });
      const box = inkBox(scratch.bitmap.data, SW, SH);
      if (!box) return;
      const dx = Math.round((W - box.w) / 2) - box.minX;
      const dy = topY - box.minY;
      await img.composite(scratch, dx, dy);
    }

    await placeCentered("NOVA", f64, 500);
    await placeCentered("nveportfolio.vercel.app", f16, 582);
  } catch (e) {
    console.warn("Text skipped (font load failed):", e.message);
  }

  await img.write(OUT);
  console.log("OG cover written ->", OUT);
})();
