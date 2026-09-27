import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Checks a deployed site end to end over real HTTP — run it right after the
// go-live switch, and any time after a deploy:
//
//   node scripts/verify-live.mjs            # production: www.saneamientos-pereda.com
//   node scripts/verify-live.mjs --dev      # staging:    dev.saneamientos-pereda.com
//
// Pages and statuses, indexing (on for www, off elsewhere), sitemap/robots,
// http -> https and apex -> www, every old WordPress URL in
// docs/seo/old-site-urls.txt followed to its final page, the API, compression
// and caching, and the files that must stay private. Read-only: it submits no
// forms and never logs in. Exits 1 if any check fails.

const ROOT = resolve(import.meta.dirname, '..');
const DEV = process.argv.includes('--dev');
const HOST = DEV ? 'dev.saneamientos-pereda.com' : 'www.saneamientos-pereda.com';
const BASE = `https://${HOST}`;
const PROD = !DEV;

let failures = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failures++;
  console.log(`${pass ? '  ✓' : '  ✗'} ${label}${detail ? ` — ${detail}` : ''}`);
};
const section = (title) => console.log(`\n${title}`);
const get = (url, opts = {}) => fetch(url, { redirect: 'manual', headers: { 'Accept-Encoding': 'gzip' }, ...opts });

async function page(path) {
  const res = await get(BASE + path);
  const html = await res.text();
  return {
    status: res.status,
    title: html.match(/<title>([^<]*)/)?.[1] ?? '',
    canonical: html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? null,
    noindex: /<meta name="robots" content="[^"]*noindex/.test(html) || /noindex/.test(res.headers.get('x-robots-tag') ?? ''),
    headers: res.headers,
    html,
  };
}

// ---------------------------------------------------------------- pages
section(`Pages on ${BASE}`);
const sitemapRes = await get(`${BASE}/sitemap.xml`);
const sitemap = await sitemapRes.text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const paths = locs.map((u) => new URL(u).pathname);
const sample = [
  '/',
  ...['/productos', '/inspirate', '/instalaciones', '/quienes-somos', '/presupuesto', '/area-profesional'].filter((p) => paths.includes(p)),
  paths.find((p) => p.startsWith('/productos/')),
  paths.find((p) => p.startsWith('/inspirate/')),
].filter(Boolean);
for (const path of sample) {
  const p = await page(path);
  const canonicalOk = PROD ? p.canonical === `https://www.saneamientos-pereda.com${path === '/' ? '/' : path}` : true;
  ok(`${path}`, p.status === 200 && p.title && canonicalOk && p.noindex === !PROD,
    `${p.status}, "${p.title.slice(0, 60)}"${PROD ? `, canonical ${canonicalOk ? 'ok' : p.canonical}` : ''}, ${p.noindex ? 'noindex' : 'indexable'}`);
}
const missing = await page('/esta-pagina-no-existe');
ok('unknown path is a real 404 with noindex', missing.status === 404 && missing.noindex, String(missing.status));
const admin = await page('/admin');
ok('/admin is never indexed', admin.status === 200 && admin.noindex, String(admin.status));
for (const path of ['/wp-login.php', '/wp-admin/', '/xmlrpc.php']) {
  const r = await get(BASE + path);
  ok(`WordPress path ${path} is gone`, r.status === 404, String(r.status));
}

// ------------------------------------------------------- sitemap & robots
section('Sitemap and robots.txt');
ok('/sitemap.xml lists the site on this host', sitemapRes.status === 200 && locs.length >= 30 && locs.every((u) => u.startsWith(`${BASE}/`)),
  `${sitemapRes.status}, ${locs.length} URLs`);
const robots = await (await get(`${BASE}/robots.txt`)).text();
if (PROD) {
  ok('robots.txt allows crawling, hides /admin, points at the sitemap',
    !/Disallow:\s*\/\s*$/m.test(robots) && /Disallow:\s*\/admin/.test(robots) && robots.includes(`Sitemap: ${BASE}/sitemap.xml`));
} else {
  ok('robots.txt on staging announces no sitemap', !/Sitemap:/.test(robots));
}

// ------------------------------------------------------------- hosts
section('https and canonical host');
const hop = async (url) => { const r = await get(url); return [r.status, r.headers.get('location')]; };
{
  const [s, loc] = await hop(`http://${HOST}/productos`);
  ok(`http://${HOST} -> https`, [301, 302].includes(s) && loc === `${BASE}/productos`, `${s} ${loc}`);
}
if (PROD) {
  for (const from of ['http://saneamientos-pereda.com/productos', 'https://saneamientos-pereda.com/productos']) {
    const [s, loc] = await hop(from);
    ok(`${from} -> www in one hop`, s === 301 && loc === `${BASE}/productos`, `${s} ${loc}`);
  }
}

// ------------------------------------------------ old WordPress URLs
section('Old WordPress URLs (docs/seo/old-site-urls.txt)');
const oldUrls = readFileSync(resolve(ROOT, 'docs/seo/old-site-urls.txt'), 'utf8')
  .split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  .map((u) => (u.startsWith('http') ? new URL(u).pathname + new URL(u).search : u));

async function follow(path) {
  let url = BASE + path;
  for (let hops = 0; hops <= 5; hops++) {
    const r = await get(url, { method: 'HEAD' });
    if (![301, 302, 307, 308].includes(r.status)) return { status: r.status, final: url, hops };
    const next = new URL(r.headers.get('location'), url);
    if (next.host !== HOST) return { status: 'offsite', final: next.href, hops: hops + 1 };
    url = next.href;
  }
  return { status: 'loop', final: url, hops: 6 };
}

const results = [];
for (let i = 0; i < oldUrls.length; i += 10) {
  results.push(...(await Promise.all(oldUrls.slice(i, i + 10).map(async (p) => ({ path: p, ...(await follow(p)) })))));
}
const tally = {};
for (const r of results) tally[`${r.status}`] = (tally[`${r.status}`] || 0) + 1;
const bad = results.filter((r) => !(r.status === 200 || r.status === 410 || r.status === 'offsite'));
const chained = results.filter((r) => r.hops > 1);
ok(`all ${results.length} old URLs end on a page, 410 or the shop`, bad.length === 0,
  Object.entries(tally).map(([k, v]) => `${k}: ${v}`).join(', '));
bad.slice(0, 15).forEach((r) => console.log(`      ${r.path} -> ${r.status} ${r.final}`));
ok('no redirect chains', chained.length === 0, `${chained.length} with more than one hop`);
chained.slice(0, 5).forEach((r) => console.log(`      ${r.path} -> ${r.hops} hops -> ${r.final}`));

// ------------------------------------------------ API, speed, privacy
section('API, compression, caching');
{
  const r = await get(`${BASE}/api/content.php?resource=brands`);
  const body = await r.json().catch(() => null);
  ok('public API answers', r.status === 200 && Array.isArray(body), `${r.status}, ${Array.isArray(body) ? body.length + ' brands' : 'not JSON'}`);
}
const asset = (await page('/')).html.match(/\/assets\/index-[^"]+\.js/)?.[0];
if (asset) {
  const r = await get(BASE + asset, { method: 'HEAD' });
  ok('JS bundle is gzipped', r.headers.get('content-encoding') === 'gzip', r.headers.get('content-encoding') ?? 'none');
  ok('JS bundle is cached for a year', /max-age=31536000/.test(r.headers.get('cache-control') ?? ''), r.headers.get('cache-control') ?? 'none');
} else {
  ok('JS bundle found in the page', false);
}

section('Private files');
for (const [path, expect] of [
  ['/api/config.php', 403], ['/api/db.php', 403], ['/sql/schema.sql', 403],
  ['/media/cvs/', 403], ['/media/cvs/cualquiera.pdf', 401], ['/api/setup.php', 404],
]) {
  const r = await get(BASE + path);
  ok(`${path}`, r.status === expect, `${r.status} (expected ${expect})`);
}
{
  const r = await get(`${BASE}/api/admin.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"list","resource":"denuncias"}' });
  ok('denuncias need a login', r.status === 401, String(r.status));
}

console.log(`\n${failures ? `✗ ${failures} check(s) failed` : '✓ all checks passed'} on ${BASE}`);
process.exitCode = failures ? 1 : 0;
