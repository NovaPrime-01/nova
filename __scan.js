const fs = require('fs');
const s = fs.readFileSync('assets/css/style.css', 'utf8');
let depth = 0, line = 1, pd = 0;
let stack = [];
let i = 0;
while (i < s.length) {
  const ch = s[i];
  if (ch === '\n') { line++; i++; continue; }
  if (ch === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e < 0 ? s.length : e + 2; continue; }
  if (ch === '"' || ch === "'") { const q = ch; i++; while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; } i++; continue; }
  if (ch === 'u' && s[i + 1] === 'r' && s[i + 2] === 'l' && s[i + 3] === '(') {
    i += 4; let p = 1;
    while (i < s.length && p > 0) { if (s[i] === '(') p++; else if (s[i] === ')') p--; i++; }
    continue;
  }
  if (ch === '{') { depth++; stack.push(line); i++; continue; }
  if (ch === '}') { depth--; stack.pop(); i++; continue; }
  i++;
}
console.log('final depth', depth);
console.log('unclosed { lines:', stack.join(', '));
