// Builds the whole site into ONE self-contained HTML file (docs/index.html),
// with scripts, styles, fonts and favicon inlined. GitHub Pages serves it from /docs.
//   npm run build:single
import { build } from 'esbuild';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, process.argv[2] || 'docs/index.html');

const result = await build({
  entryPoints: [resolve(root, 'src/main.jsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  jsx: 'automatic',
  target: ['es2019'],
  write: false,
  outdir: 'out',
  loader: { '.ttf': 'dataurl', '.woff2': 'dataurl', '.otf': 'dataurl', '.svg': 'dataurl' },
  external: ['/fonts/*'],
  define: {
    'process.env.NODE_ENV': '"production"',
    'import.meta.env': JSON.stringify({ VITE_FORM_ENDPOINT: process.env.VITE_FORM_ENDPOINT || '' }),
  },
  logLevel: 'warning',
});

const js = result.outputFiles.find((f) => f.path.endsWith('.js')).text;
let css = result.outputFiles.find((f) => f.path.endsWith('.css')).text;

// Céline slot: inline the licensed font if it's in public/fonts, otherwise drop the rule
const celineFile = ['Celine.woff2', 'Celine.otf'].map((f) => resolve(root, 'public/fonts', f));
let celine = null;
for (const f of celineFile) {
  try {
    await access(f);
    celine = f;
    break;
  } catch {}
}
const celineRule = /@font-face\s*{[^}]*Celine[^}]*}/;
if (celine) {
  const data = (await readFile(celine)).toString('base64');
  const fmt = celine.endsWith('.woff2') ? 'woff2' : 'opentype';
  const mime = celine.endsWith('.woff2') ? 'font/woff2' : 'font/otf';
  css = css.replace(celineRule, `@font-face{font-family:"Celine";src:url(data:${mime};base64,${data}) format("${fmt}");font-display:swap}`);
  console.log('  using Céline from', celine);
} else {
  css = css.replace(celineRule, '');
}
const favicon = await readFile(resolve(root, 'public/favicon.svg'), 'utf8');

let html = await readFile(resolve(root, 'index.html'), 'utf8');
html = html
  .replace(
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
    `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(favicon)}" />`
  )
  .replace('</head>', () => `    <style>${css}</style>\n  </head>`)
  .replace('<script type="module" src="/src/main.jsx"></script>', () => `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>`);

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, html);
console.log(`✓ ${outFile} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
