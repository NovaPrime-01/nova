// Minimal zero-dependency build: copy the static site into ./dist
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dist = path.join(root, 'dist');

const copyPaths = ['index.html', 'assets'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const p of copyPaths) {
  const src = path.join(root, p);
  if (!fs.existsSync(src)) {
    console.warn('Skipping missing:', p);
    continue;
  }
  fs.cpSync(src, path.join(dist, p), { recursive: true });
  console.log('Copied:', p);
}

const count = fs.readdirSync(dist, { recursive: true }).length;
console.log('Build complete ->', dist, '(' + count + ' entries)');
