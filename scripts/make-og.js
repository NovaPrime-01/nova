/* =============================================================================
   NOVA — OG COVER GENERATOR
   Creates assets/img/og-cover.png (1200x630) with jimp: dark cinematic
   background, glow, grid, geometric N monogram, "NOVA" wordmark + tagline.
   Run: node scripts/make-og.js
============================================================================= */
const { Jimp, loadFont } = require("jimp");
const path = require("path");

const W = 1200, H = 630;
const OUT = path.join(__dirname, "..", "assets", "img", "og-cover.png");
const FONT_DIR = path.join(
  __dirname, "..", "node_modules", "@jimp", "plugin-print", "fonts", "open-sans"
);

const BG = { r: 10, g: 10, b: 11 };        // #0A0A0B
const ACCENT = { r: 255, g: 77, b: 46 };   // #FF4D2E
const BLUE = { r: 54, g: 123, b: 255 };    // #367BFF
const WHITE = { r: 245, g: 247, b: 255 };  // #F5F7FF
const DIM = { r: 150, g: 152, b: 160 };    // muted grey

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
  const img = new Jimp({ width: W, height: H, color: 0x0a0a0bff });

  const d = img.bitmap.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (W * y + x) << 2;
      // base vertical gradient: slightly lighter at top
      const g = 1 - y / H * 0.5;
      d[idx] = 8 + 14 * g;
      d[idx + 1] = 8 + 14 * g;
      d[idx + 2] = 12 + 16 * g;
      d[idx + 3] = 255;
    }
  }

  // radial glows (accent left-bottom, blue right-top)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx1 = (x - W * 0.18) / (W * 0.42), dy1 = (y - H * 0.82) / (H * 0.55);
      const a1 = Math.max(0, 1 - (dx1 * dx1 + dy1 * dy1)) * 0.34;
      const dx2 = (x - W * 0.86) / (W * 0.40), dy2 = (y - H * 0.14) / (H * 0.50);
      const a2 = Math.max(0, 1 - (dx2 * dx2 + dy2 * dy2)) * 0.26;
      blend(img, x, y, ACCENT, a1);
      blend(img, x, y, BLUE, a2);
    }
  }

  // subtle grid, masked toward edges
  for (let x = 0; x < W; x += 60) {
    for (let y = 0; y < H; y++) {
      const cx = (x - W / 2) / (W / 2), cy = (y - H / 2) / (H / 2);
      const fall = Math.max(0, 1 - (cx * cx + cy * cy) * 1.1);
      blend(img, x, y, { r: 255, g: 255, b: 255 }, 0.045 * fall);
    }
  }
  for (let y = 0; y < H; y += 60) {
    for (let x = 0; x < W; x++) {
      const cx = (x - W / 2) / (W / 2), cy = (y - H / 2) / (H / 2);
      const fall = Math.max(0, 1 - (cx * cx + cy * cy) * 1.1);
      blend(img, x, y, { r: 255, g: 255, b: 255 }, 0.045 * fall);
    }
  }

  // geometric N monogram (left), stroke drawn as thick segments
  const nx = 200, ny = 210, nw = 200, nh = 200, t = 22;
  function seg(x1, y1, x2, y2) {
    const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1)) * 2;
    for (let s = 0; s <= steps; s++) {
      const px = x1 + ((x2 - x1) * s) / steps;
      const py = y1 + ((y2 - y1) * s) / steps;
      for (let oy = -t / 2; oy <= t / 2; oy++) {
        for (let ox = -t / 2; ox <= t / 2; ox++) {
          const X = Math.round(px + ox), Y = Math.round(py + oy);
          if (X >= 0 && X < W && Y >= 0 && Y < H) blend(img, X, Y, ACCENT, 0.95);
        }
      }
    }
  }
  seg(nx, ny + nh, nx, ny);           // left stem
  seg(nx, ny, nx + nw, ny + nh);      // diagonal
  seg(nx + nw, ny + nh, nx + nw, ny); // right stem

  // text
  try {
    const f128 = await loadFont(path.join(FONT_DIR, "open-sans-128-white", "open-sans-128-white.fnt"));
    const f16 = await loadFont(path.join(FONT_DIR, "open-sans-16-white", "open-sans-16-white.fnt"));

    img.print({ font: f128, x: 450, y: 175, text: "NOVA" });
    img.print({ font: f16, x: 455, y: 330, text: "DIGITAL CREATOR  \u00B7  GAMING  \u00B7  TECHNOLOGY  \u00B7  CREATIVE" });
    img.print({ font: f16, x: 455, y: 360, text: "Imagine Beyond. Create Without Limits." });
    img.print({ font: f16, x: 455, y: 548, text: "nveportfolio.vercel.app" });
  } catch (e) {
    console.warn("Text skipped (font load failed):", e.message);
  }

  await img.write(OUT);
  console.log("OG cover written ->", OUT);
})();
