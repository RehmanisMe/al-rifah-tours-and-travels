/**
 * Verifies that every local asset referenced by the site resolves, and walks the
 * ES module import graph so a broken relative import is caught here rather than
 * silently failing in the browser.
 *
 * Usage:  node tools/check-links.mjs [baseUrl]
 */
const BASE = process.argv[2] || 'http://localhost:5000';

const PAGES = ['/index.html', '/umrah-cost-calculator.html', '/404.html', '/site.webmanifest'];

/** Resolves a possibly-relative href against a directory path. */
function resolvePath(from, ref) {
  if (ref.startsWith('/')) return ref;
  const base = from.slice(0, from.lastIndexOf('/') + 1);
  const url = new URL(ref, 'http://x' + base);
  return url.pathname;
}

const seen = new Map(); // path -> { status, bytes, via }
const problems = [];

async function fetchOnce(path, via) {
  if (seen.has(path)) return seen.get(path);
  const res = await fetch(BASE + path);
  const bytes = Buffer.from(await res.arrayBuffer());
  const entry = { status: res.status, bytes: bytes.length, body: bytes.toString('utf8'), via };
  seen.set(path, entry);
  // 404.html is intentionally served with a 404 status.
  if (!res.ok && path !== '/404.html') problems.push(`${res.status}  ${path}   (referenced by ${via})`);
  return entry;
}

/** Extracts local asset references from an HTML document. */
function htmlRefs(html) {
  const refs = new Set();
  for (const m of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/g)) refs.add(m[1]);
  for (const m of html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  return [...refs].filter(
    (r) => r && !/^(https?:)?\/\//.test(r) && !/^(mailto:|tel:|data:|#)/.test(r)
  );
}

/** Extracts static import specifiers from a JS module. */
function moduleImports(js) {
  const refs = new Set();
  for (const m of js.matchAll(/(?:^|\s)(?:import|export)[\s\S]*?from\s*['"]([^'"]+)['"]/g)) refs.add(m[1]);
  for (const m of js.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) refs.add(m[1]);
  // Bare CDN imports are external and intentionally left alone.
  return [...refs].filter((r) => r.startsWith('.') || r.startsWith('/'));
}

/** Recursively verifies a module and everything it imports. */
async function walkModule(path, via) {
  const entry = await fetchOnce(path, via);
  if (entry.status !== 200) return;
  for (const ref of moduleImports(entry.body)) {
    await walkModule(resolvePath(path, ref), path);
  }
}

for (const page of PAGES) {
  const entry = await fetchOnce(page, '(entry)');
  if (entry.status !== 200 && page !== '/404.html') continue;

  if (page.endsWith('.webmanifest')) {
    for (const icon of JSON.parse(entry.body).icons ?? []) {
      await fetchOnce(resolvePath(page, icon.src), page);
    }
    continue;
  }

  for (const ref of htmlRefs(entry.body)) {
    const path = resolvePath(page, ref).split('#')[0];
    if (!/\.\w{2,12}$/.test(path)) continue; // skip in-page anchors and bare paths
    if (path.endsWith('.js')) await walkModule(path, page);
    else await fetchOnce(path, page);
  }
}

const rows = [...seen.entries()].sort();
console.log('STATUS   BYTES  PATH');
for (const [path, { status, bytes }] of rows) {
  console.log(`${String(status).padEnd(7)}${String(bytes).padStart(7)}  ${path}`);
}

const modules = rows.filter(([p]) => p.endsWith('.js')).length;
console.log(`\n${rows.length} resources checked (${modules} JS modules in the graph)`);
console.log(problems.length === 0 ? 'PASS - everything resolves.' : 'FAIL:\n' + problems.join('\n'));
process.exit(problems.length === 0 ? 0 : 1);
