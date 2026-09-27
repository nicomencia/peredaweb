import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Checks public/.htaccess (the live redirect map) against every URL the old WordPress site
// published in its Yoast sitemap (snapshot: docs/seo/old-site-urls.txt).
// Reports where each old URL ends up, which ones fall through with no redirect,
// redirect chains, and targets that are not real routes of the new site.
//
// Usage:
//   node scripts/check-redirects.mjs             # check against the snapshot
//   node scripts/check-redirects.mjs --verbose   # also list the URLs per destination
//   node scripts/check-redirects.mjs --refresh   # re-download the live sitemap first
//   node scripts/check-redirects.mjs draft.htaccess   # check a draft map instead
//
// Simulates mod_rewrite in .htaccess context: the pattern sees the path without
// its leading slash, requests arrive over HTTPS on the canonical www host, and
// -f/-d conditions are false (no old URL exists as a file in the new docroot).
// Only redirecting rules count ([R], [G], [F]); internal rewrites are ignored.
// Exits 1 if anything falls through or lands on an unknown route.

const ROOT = resolve(import.meta.dirname, '..');
const HTACCESS = resolve(ROOT, process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'public/.htaccess');
const SNAPSHOT = resolve(ROOT, 'docs/seo/old-site-urls.txt');
const HOST = 'www.saneamientos-pereda.com';
const OLD_ORIGIN = `https://${HOST}`;
const MAX_HOPS = 5;
const args = new Set(process.argv.slice(2));

if (args.has('--refresh')) await refreshSnapshot();

// Routes of the new site, read from the code so this stays in sync: static
// routes from the front controller's sitemap list, categories from the grid.
const indexPhp = readFileSync(resolve(ROOT, 'public/index.php'), 'utf8');
const routesBlock = indexPhp.match(/\$ROUTES\s*=\s*\[([\s\S]*?)\];/)?.[1] ?? '';
const ROUTES = new Set([...routesBlock.matchAll(/'([^']+)'/g)].map((m) => m[1]));
const productos = readFileSync(resolve(ROOT, 'src/components/Productos.jsx'), 'utf8');
const CATEGORIES = new Set([...productos.matchAll(/key:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]));
if (!ROUTES.size || !CATEGORIES.size) {
  console.error('Could not read the route list from public/index.php or the categories from Productos.jsx.');
  process.exit(1);
}

const normalize = (p) => (p === '/' ? '/' : p.replace(/\/+$/, ''));

function isKnownRoute(path) {
  const p = normalize(path);
  if (ROUTES.has(p)) return true;
  const cat = p.match(/^\/productos\/([^/]+)$/);
  if (cat) return CATEGORIES.has(cat[1]);
  return /^\/inspirate\/[^/]+$/.test(p); // ambiente ids live in the DB
}

function parseRules(text) {
  const rules = [];
  let conds = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    let m = line.match(/^RewriteCond\s+(\S+)\s+(\S+)(?:\s+\[([^\]]+)\])?/);
    if (m) {
      conds.push({ test: m[1], pattern: m[2], flags: m[3] || '' });
      continue;
    }
    m = line.match(/^RewriteRule\s+(\S+)\s+(\S+)(?:\s+\[([^\]]+)\])?/);
    if (m) {
      const flags = (m[3] || '').split(',').map((f) => f.trim().toUpperCase());
      rules.push({ re: new RegExp(m[1], flags.includes('NC') ? 'i' : ''), target: m[2], flags, conds });
      conds = [];
    }
  }
  return rules;
}

const unknownConds = new Set();
function condHolds({ test, pattern, flags }) {
  const negate = pattern.startsWith('!');
  const p = negate ? pattern.slice(1) : pattern;
  let result;
  if (p === '-f' || p === '-d') result = false;
  else if (test === '%{HTTP_HOST}') result = new RegExp(p, /NC/i.test(flags) ? 'i' : '').test(HOST);
  else if (test === '%{HTTPS}') result = new RegExp(p, 'i').test('on');
  else {
    unknownConds.add(test);
    result = true;
  }
  return negate ? !result : result;
}

const rules = parseRules(readFileSync(HTACCESS, 'utf8'));

// One pass of the rule list for a path: the first redirecting rule that applies.
function resolveOnce(path) {
  const rel = path.replace(/^\//, '');
  for (const rule of rules) {
    const redirect = rule.flags.some((f) => f.startsWith('R'));
    const gone = rule.flags.includes('G') || rule.flags.includes('R=410');
    const forbidden = rule.flags.includes('F');
    if (!redirect && !gone && !forbidden) continue;
    const match = rule.re.exec(rel);
    if (!match || !rule.conds.every(condHolds)) continue;
    if (gone) return { kind: 'gone' };
    if (forbidden) return { kind: 'forbidden' };
    const to = rule.target
      .replace(/\$(\d)/g, (_, i) => match[Number(i)] ?? '')
      .replace(/%\{REQUEST_URI\}/g, path);
    return { kind: 'redirect', to };
  }
  return null;
}

function follow(path) {
  const hops = [];
  let current = path;
  for (let i = 0; i < MAX_HOPS; i++) {
    const step = resolveOnce(current);
    if (!step) break;
    if (step.kind !== 'redirect') return { kind: step.kind, hops };
    hops.push(step.to);
    let next = step.to;
    if (/^https?:\/\//i.test(next)) {
      const url = new URL(next);
      if (url.host !== HOST) return { kind: 'offsite', final: next, hops };
      next = url.pathname;
    }
    if (hops.length > 1 && hops.slice(0, -1).includes(step.to)) return { kind: 'loop', hops };
    current = next;
  }
  return { kind: hops.length ? 'redirect' : 'none', final: current, hops };
}

const paths = readFileSync(SNAPSHOT, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const byDestination = new Map();
const fallThrough = [];
const unknownTarget = [];
const chains = [];
const loops = [];
const add = (label, path) => {
  if (!byDestination.has(label)) byDestination.set(label, []);
  byDestination.get(label).push(path);
};

for (const path of paths) {
  const r = follow(path);
  if (r.hops.length > 1) chains.push(`${path} -> ${r.hops.join(' -> ')}`);
  if (r.kind === 'loop') loops.push(`${path} -> ${r.hops.join(' -> ')}`);
  else if (r.kind === 'gone') add('gone (410)', path);
  else if (r.kind === 'forbidden') add('forbidden (403)', path);
  else if (r.kind === 'offsite') add(`off-site: ${r.final}`, path);
  else if (r.kind === 'none') {
    if (isKnownRoute(path)) add('served as-is (same path on the new site)', path);
    else fallThrough.push(path);
  } else if (isKnownRoute(r.final)) add(normalize(r.final), path);
  else unknownTarget.push(`${path} -> ${r.final}`);
}

console.log(`Old URLs: ${paths.length}   redirect rules: ${rules.length}   new-site routes: ${ROUTES.size} + ${CATEGORIES.size} categories\n`);
for (const [label, list] of [...byDestination].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${String(list.length).padStart(5)}  ${label}`);
  if (args.has('--verbose')) list.forEach((p) => console.log(`         ${p}`));
}
const section = (title, list) => {
  console.log(`\n${title}: ${list.length}`);
  list.forEach((l) => console.log(`   ${l}`));
};
section('Fall through with no redirect', fallThrough);
section('Redirect to a route the new site does not have', unknownTarget);
section('Redirect loops', loops);
section('Chains (more than one hop)', chains);
if (unknownConds.size) console.log(`\nNote: assumed true for unsupported conditions: ${[...unknownConds].join(', ')}`);

process.exit(fallThrough.length || unknownTarget.length || loops.length ? 1 : 0);

async function refreshSnapshot() {
  const get = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
    return res.text();
  };
  const index = await get(`${OLD_ORIGIN}/sitemap_index.xml`);
  // After the swap this URL redirects to the new sitemap; never overwrite the
  // snapshot of the old site with it.
  if (!index.includes('<sitemapindex')) {
    console.error('The live sitemap is no longer the WordPress/Yoast index — keeping the existing snapshot.');
    process.exit(1);
  }
  const found = new Set();
  for (const [, child] of index.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const xml = await get(child);
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (!loc.includes('/wp-content/')) found.add(new URL(loc).pathname);
    }
  }
  const sorted = [...found].sort();
  const date = new Date().toISOString().slice(0, 10);
  writeFileSync(SNAPSHOT, `# ${sorted.length} URLs from ${OLD_ORIGIN}/sitemap_index.xml, fetched ${date}\n${sorted.join('\n')}\n`);
  console.log(`Snapshot refreshed: ${sorted.length} URLs\n`);
}
