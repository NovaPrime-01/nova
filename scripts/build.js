// Minimal zero-dependency build: copy the static site into ./public
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outDir = path.join(root, 'public');

const copyPaths = ['index.html', 'assets'];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const p of copyPaths) {
  const src = path.join(root, p);
  if (!fs.existsSync(src)) {
    console.warn('Skipping missing:', p);
    continue;
  }
  fs.cpSync(src, path.join(outDir, p), { recursive: true });
  console.log('Copied:', p);
}

const count = fs.readdirSync(outDir, { recursive: true }).length;
console.log('Build complete -> ' + outDir + ' (' + count + ' entries)');
