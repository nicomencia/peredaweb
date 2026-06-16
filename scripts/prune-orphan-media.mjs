import 'dotenv/config';
import mysql from 'mysql2/promise';
import SftpClient from 'ssh2-sftp-client';

// Finds media files on the server that NO database row references (orphans left
// behind when an admin replaces an image) and optionally deletes them.
//
//   node scripts/prune-orphan-media.mjs              # dry run: list orphans only
//   node scripts/prune-orphan-media.mjs --delete     # actually delete them
//   node scripts/prune-orphan-media.mjs --days 30    # grace period (default 7)
//
// Safety rails:
//  - Dry run by default; never deletes without --delete.
//  - Grace period: never touches files modified in the last N days (avoids
//    deleting a fresh upload not yet saved/referenced).
//  - Skips /media/base/ (bundled defaults + favicon, referenced outside the DB).
const REMOTE_MEDIA = '/html/dev/media';
const args = process.argv.slice(2);
const DO_DELETE = args.includes('--delete');
const GRACE_DAYS = (() => {
  const i = args.indexOf('--days');
  return i !== -1 && args[i + 1] ? Number(args[i + 1]) : 7;
})();
const graceCutoff = Date.now() - GRACE_DAYS * 86400000;

// Columns across all tables that may hold a /media path.
const REF_COLUMNS = {
  products: ['image_url', 'secondary_image_url', 'thumbnail_url'],
  product_photos: ['image_url'],
  brands: ['logo_url'],
  ambientes: ['cover_image_url'],
  ambiente_photos: ['image_url'],
  tiendas: ['cover_image_url'],
  tienda_photos: ['image_url'],
  site_settings: ['value'],
  job_applications: ['cv_url'],
};

const conn = await mysql.createConnection({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS,
  database: process.env.DB_NAME, ssl: { rejectUnauthorized: false },
});

// 1. Every /media path referenced anywhere in the DB.
const referenced = new Set();
const [tables] = await conn.query('SHOW TABLES');
const present = new Set(tables.map((r) => Object.values(r)[0]));
for (const [table, cols] of Object.entries(REF_COLUMNS)) {
  if (!present.has(table)) continue;
  const [rows] = await conn.query(`SELECT ${cols.map((c) => `\`${c}\``).join(',')} FROM \`${table}\``);
  for (const row of rows) {
    for (const c of cols) {
      const v = row[c];
      if (typeof v === 'string') {
        const m = v.match(/\/media\/[^\s"')]+/g);
        if (m) m.forEach((p) => referenced.add(p));
      }
    }
  }
}
await conn.end();

// 2. Walk the media tree on the server.
const sftp = new SftpClient();
await sftp.connect({
  host: process.env.SFTP_HOST, port: Number(process.env.SFTP_PORT) || 22,
  username: process.env.SFTP_USER, password: process.env.SFTP_PASS,
  readyTimeout: 20000, tryKeyboard: true,
});

const orphans = [];
let scanned = 0;
async function walk(dir) {
  for (const item of await sftp.list(dir)) {
    const path = `${dir}/${item.name}`;
    if (item.type === 'd') {
      await walk(path);
    } else {
      if (item.name.startsWith('.')) continue;                // dotfiles (.htaccess)
      scanned++;
      const url = path.replace('/html/dev', ''); // -> /media/...
      if (url.startsWith('/media/base/')) continue;          // managed defaults
      if (referenced.has(url)) continue;                      // still in use
      if (item.modifyTime > graceCutoff) continue;            // too recent
      orphans.push({ url, size: item.size, path });
    }
  }
}
try {
  await walk(REMOTE_MEDIA);

  const totalKB = Math.round(orphans.reduce((s, o) => s + o.size, 0) / 1024);
  console.log(`Scanned ${scanned} files, ${referenced.size} referenced.`);
  console.log(`Orphans (>${GRACE_DAYS}d old, not /media/base/): ${orphans.length} (${totalKB} KB)\n`);
  for (const o of orphans) console.log(`  ${o.url}  (${Math.round(o.size / 1024)} KB)`);

  if (!orphans.length) {
    console.log('\nNothing to prune.');
  } else if (DO_DELETE) {
    for (const o of orphans) await sftp.delete(o.path);
    console.log(`\nDeleted ${orphans.length} orphan file(s).`);
  } else {
    console.log('\nDry run — re-run with --delete to remove them.');
  }
} finally {
  await sftp.end();
}
