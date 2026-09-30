// Lists raw colours in components. Design tokens live in src/index.css only
// (see docs/design-system.md); components must use token names.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = new URL('../src', import.meta.url).pathname;

const PALETTE = 'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone';
const RULES = [
  { name: 'Tailwind palette class', re: new RegExp(`\\b[a-z-]*-(?:${PALETTE})-\\d{2,3}\\b`, 'g') },
  { name: 'hex colour', re: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'rgb/hsl/oklch colour', re: /\b(?:rgba?|hsla?|oklch)\([^)]*\)/g },
];

const files = readdirSync(SRC, { recursive: true })
  .filter((f) => /\.(tsx?|jsx?)$/.test(f))
  .map((f) => join(SRC, f));

let total = 0;
const perFile = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  let count = 0;
  for (const { re } of RULES) count += (text.match(re) ?? []).length;
  if (count > 0) perFile.push([relative(SRC, file), count]);
  total += count;
}

perFile.sort((a, b) => b[1] - a[1]);
for (const [file, count] of perFile) console.log(`${String(count).padStart(4)}  src/${file}`);
console.log(total === 0 ? 'No raw colours. All components use design tokens.' : `\n${total} raw colours in ${perFile.length} files. Use tokens from src/index.css instead.`);
process.exit(total === 0 ? 0 : 1);
