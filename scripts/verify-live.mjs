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
// Some networks block outgoing port 80 altogether (even http://example.com times
// out). That says nothing about the site, so it is reported as unchecked rather
// than failed — or crashing the run.
let unchecked = 0;
const hop = async (url) => {
  try {
    const r = await get(url, { signal: AbortSignal.timeout(15000) });
    return [r.status, r.headers.get('location')];
  } catch {
    return [null, null];
  }
};
const hopCheck = async (url, label, pass) => {
  const [s, loc] = await hop(url);
  if (s === null) {
    unchecked++;
    console.log(`  ? ${label} — could not connect from this network; check it from another (e.g. a phone on mobile data)`);
  } else {
    ok(label, pass(s, loc), `${s} ${loc}`);
  }
};
// The certificate is renewed by hand (see IMPROVEMENTS.md): fail three weeks
// before it expires, not after, so the daily monitor gives notice.
{
  const { connect: tlsConnect } = await import('node:tls');
  const validTo = await new Promise((resolve) => {
    const socket = tlsConnect({ host: HOST, port: 443, servername: HOST, timeout: 15000 }, () => {
      const to = socket.getPeerCertificate()?.valid_to;
      socket.end();
      resolve(to ? new Date(to) : null);
    });
    socket.on('error', () => resolve(null));
    socket.on('timeout', () => { socket.destroy(); resolve(null); });
  });
  if (!validTo) {
    unchecked++;
    console.log('  ? certificate — could not connect from this network');
  } else {
    const days = Math.floor((validTo - Date.now()) / 86400000);
    ok('SSL certificate valid for 21+ more days', days >= 21, `expires ${validTo.toISOString().slice(0, 10)} (${days} days)`);
  }
}
await hopCheck(`http://${HOST}/productos`, `http://${HOST} -> https`, (s, loc) => [301, 302].includes(s) && loc === `${BASE}/productos`);
if (PROD) {
  for (const from of ['http://saneamientos-pereda.com/productos', 'https://saneamientos-pereda.com/productos']) {
    await hopCheck(from, `${from} -> www in one hop`, (s, loc) => s === 301 && loc === `${BASE}/productos`);
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
    // One retry on a network error: a flaky connection is not a broken redirect.
    let r;
    try {
      r = await get(url, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
    } catch {
      try {
        r = await get(url, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
      } catch {
        return { status: 'network', final: url, hops };
      }
    }
    if (![301, 302, 307, 308].includes(r.status)) return { status: r.status, final: url, hops };
    const next = new URL(r.headers.get('location'), url);
    if (next.host !== HOST) return { status: 'offsite', final: next.href, hops: hops + 1 };
    url = next.href;
  }
  return { status: 'loop', final: url, hops: 6 };
}

const results = [];
for (let i = 0; i < oldUrls.length; i += 5) {
  results.push(...(await Promise.all(oldUrls.slice(i, i + 5).map(async (p) => ({ path: p, ...(await follow(p)) })))));
}
const tally = {};
for (const r of results) tally[`${r.status}`] = (tally[`${r.status}`] || 0) + 1;
const network = results.filter((r) => r.status === 'network');
const bad = results.filter((r) => !(r.status === 200 || r.status === 410 || r.status === 'offsite' || r.status === 'network'));
if (network.length) {
  unchecked += network.length;
  console.log(`  ? ${network.length} old URL(s) could not be reached from this network (twice); rerun later`);
}
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

console.log(`\n${failures ? `✗ ${failures} check(s) failed` : '✓ all checks passed'} on ${BASE}${unchecked ? ` (${unchecked} check(s) could not run from this network)` : ''}`);
process.exitCode = failures ? 1 : 0;
