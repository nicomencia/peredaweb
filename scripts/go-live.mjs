import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { connect, PROD_ROOT, DEV_ROOT, wordpressInProd } from './lib/remote.mjs';

// The WordPress -> new site switch on www, in reviewable phases:
//
//   node scripts/go-live.mjs plan       dry run: what moves, what stays, what's missing
//   node scripts/go-live.mjs preload    build + upload the new site NEXT TO WordPress
//                                       (assets, base, api, config, media); WordPress
//                                       keeps serving, because its index.php and
//                                       .htaccess are untouched
//   node scripts/go-live.mjs switch     move WordPress's own files to /data/wp-old and
//                                       put our index.php / index.html / .htaccess in
//   node scripts/go-live.mjs rollback   the reverse of switch
//
// Only WordPress's own files move. Other folders in /html (old sites, scripts) stay
// where they are - their cleanup is a separate, later decision (IMPROVEMENTS.md F).
// Run from PowerShell (see CLAUDE.md), from the repo root.

const ROOT = resolve(import.meta.dirname, '..');
const DIST = resolve(ROOT, 'dist');
const WP_OLD = '/data/wp-old';
const PLAN_FILE = `${WP_OLD}/.go-live-plan.json`;
const SITE = 'https://www.saneamientos-pereda.com';

// WordPress's own entries in /html.
const isWordPress = (name) => /^(wp-.*|xmlrpc\.php|license\.txt|readme\.html|index\.php|\.htaccess)$/.test(name);
// The new site's folders, preloaded before the switch.
const SITE_DIRS = ['api', 'assets', 'base', 'media', 'sql'];
// The new site's entry points: the only files the switch itself puts in place.
const ENTRY = ['index.php', 'index.html', '.htaccess'];
const STAGED = (name) => `${PROD_ROOT}/${name}.go-live`;

const phase = process.argv[2];
const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: 'inherit' });

// Every /assets file the built index.html points at: the switch must not start
// unless exactly this build is already on the server.
function builtAssets() {
  const html = readFileSync(resolve(DIST, 'index.html'), 'utf8');
  return [...new Set(html.match(/\/assets\/[^"')\s]+/g) || [])];
}

async function copyMedia(sftp) {
  let copied = 0, present = 0;
  const walk = async (rel) => {
    await sftp.mkdir(`${PROD_ROOT}/media${rel}`, true);
    for (const it of await sftp.list(`${DEV_ROOT}/media${rel}`)) {
      const path = `${rel}/${it.name}`;
      if (it.type === 'd') { await walk(path); continue; }
      const dest = `${PROD_ROOT}/media${path}`;
      const existing = await sftp.stat(dest).catch(() => null);
      if (existing && existing.size === it.size) { present++; continue; }
      await sftp.put(await sftp.get(`${DEV_ROOT}/media${path}`), dest);
      copied++;
    }
  };
  await walk('');
  console.log(`  media: ${copied} copied, ${present} already there`);
}

async function plan(sftp) {
  const entries = await sftp.list(PROD_ROOT);
  const names = entries.map((e) => e.name).sort();
  const wp = names.filter(isWordPress);
  const site = names.filter((n) => SITE_DIRS.includes(n));
  const other = names.filter((n) => !isWordPress(n) && !SITE_DIRS.includes(n) && n !== 'dev' && !n.endsWith('.go-live'));

  console.log(`\nWordPress in ${PROD_ROOT}: ${(await wordpressInProd(sftp)) ? 'yes' : 'NO (already switched?)'}`);
  console.log(`\nWill MOVE to ${WP_OLD}/ (${wp.length}):\n  ${wp.join('\n  ')}`);
  console.log(`\nStays in place, not WordPress (${other.length}):\n  ${other.join('\n  ') || '-'}`);
  console.log(`\nStaging (untouched): dev`);
  console.log(`\nNew site preloaded: ${SITE_DIRS.map((d) => `${d} ${site.includes(d) ? '✓' : '✗'}`).join(', ')}`);

  if (existsSync(resolve(DIST, 'index.html'))) {
    const assets = builtAssets();
    const missing = [];
    for (const a of assets) if (!(await sftp.exists(PROD_ROOT + a))) missing.push(a);
    console.log(`Current build's assets on the server: ${assets.length - missing.length}/${assets.length}${missing.length ? ' (run preload)' : ' ✓'}`);
  }
  console.log(`api/config.php: ${(await sftp.exists(`${PROD_ROOT}/api/config.php`)) ? '✓' : '✗'}`);
  console.log(`${WP_OLD}: ${(await sftp.exists(WP_OLD)) ? 'EXISTS - switch will refuse' : 'free ✓'}`);

  if (wp.includes('.htaccess')) {
    console.log(`\n----- WordPress .htaccess (check for rules the new one must keep) -----`);
    console.log((await sftp.get(`${PROD_ROOT}/.htaccess`)).toString().trim());
    console.log('-----');
  }
}

async function preload(sftp) {
  run('node scripts/sync-base-images.mjs');
  run('npm run build');
  console.log(`Uploading the build next to WordPress (not ${ENTRY.join(', ')}) ...`);
  for (const name of readdirSync(DIST)) {
    if (ENTRY.includes(name)) continue;
    const local = resolve(DIST, name);
    if (!statSync(local).isDirectory()) {
      await sftp.put(local, `${PROD_ROOT}/${name}`);
    } else if (readdirSync(local).length) { // skip empty leftover folders
      await sftp.uploadDir(local, `${PROD_ROOT}/${name}`);
    }
    console.log(`  ${name} ✓`);
  }
  await sftp.end();
  run('node scripts/push-api.mjs --prod');
  run('node scripts/push-config.mjs --prod');
  const again = await connect();
  try {
    console.log('Copying media from staging ...');
    await copyMedia(again);
  } finally {
    await again.end();
  }
  // WordPress serves real files as-is, so the preloaded API already answers on www.
  const res = await fetch(`${SITE}/api/content.php?resource=brands`);
  console.log(`API on www before the switch: ${res.status} ${res.headers.get('content-type')}`);
}

async function doSwitch(sftp) {
  if (!(await wordpressInProd(sftp))) throw new Error(`No WordPress in ${PROD_ROOT} - nothing to switch.`);
  if (await sftp.exists(WP_OLD)) throw new Error(`${WP_OLD} already exists - resolve that first.`);
  for (const a of builtAssets()) {
    if (!(await sftp.exists(PROD_ROOT + a))) throw new Error(`${a} is not on the server - run preload with this build.`);
  }
  if (!(await sftp.exists(`${PROD_ROOT}/api/config.php`))) throw new Error('api/config.php missing - run preload.');

  const moves = (await sftp.list(PROD_ROOT)).map((e) => e.name).filter(isWordPress);

  // 1. Stage our entry files under temporary names (harmless; nothing reads them).
  for (const name of ENTRY) await sftp.put(resolve(DIST, name), STAGED(name));
  // 2. Record the plan before moving anything, so rollback works even if this stops halfway.
  await sftp.mkdir(WP_OLD, true);
  await sftp.put(Buffer.from(JSON.stringify({ at: new Date().toISOString(), moves }, null, 2)), PLAN_FILE);
  // 3. Renames only from here on: the site is down for seconds.
  const t0 = Date.now();
  for (const name of moves) await sftp.rename(`${PROD_ROOT}/${name}`, `${WP_OLD}/${name}`);
  for (const name of ENTRY) await sftp.rename(STAGED(name), `${PROD_ROOT}/${name}`);
  console.log(`Switched in ${((Date.now() - t0) / 1000).toFixed(1)} s: ${moves.length} WordPress entries -> ${WP_OLD}/`);

  const res = await fetch(`${SITE}/`, { redirect: 'manual' });
  const title = (await res.text()).match(/<title>([^<]*)/)?.[1];
  console.log(`${SITE}/ -> ${res.status} "${title}"`);
}

async function rollback(sftp) {
  if (!(await sftp.exists(PLAN_FILE))) throw new Error(`${PLAN_FILE} not found - nothing to roll back.`);
  const { moves } = JSON.parse((await sftp.get(PLAN_FILE)).toString());
  // Park our entry files, then put WordPress's back.
  const parked = `/data/new-site-entry-${Date.now()}`;
  await sftp.mkdir(parked, true);
  for (const name of ENTRY) {
    if (await sftp.exists(`${PROD_ROOT}/${name}`)) await sftp.rename(`${PROD_ROOT}/${name}`, `${parked}/${name}`);
  }
  let restored = 0;
  for (const name of moves) {
    if (await sftp.exists(`${WP_OLD}/${name}`)) {
      await sftp.rename(`${WP_OLD}/${name}`, `${PROD_ROOT}/${name}`);
      restored++;
    }
  }
  await sftp.delete(PLAN_FILE);
  await sftp.rmdir(WP_OLD).catch(() => console.log(`(${WP_OLD} not empty - left in place)`));
  console.log(`Rolled back: ${restored}/${moves.length} WordPress entries restored; our entry files parked in ${parked}/`);
}

const phases = { plan, preload, switch: doSwitch, rollback };
if (!phases[phase]) {
  console.error('Usage: node scripts/go-live.mjs plan|preload|switch|rollback');
  process.exit(1);
}
const sftp = await connect();
try {
  await phases[phase](sftp);
} catch (err) {
  console.error(`\n${phase} stopped: ${err.message}`);
  process.exitCode = 1;
} finally {
  await sftp.end().catch(() => {});
}
