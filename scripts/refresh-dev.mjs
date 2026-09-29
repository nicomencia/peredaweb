import 'dotenv/config';
import mysql from 'mysql2/promise';
import { connect, PROD_ROOT, DEV_ROOT } from './lib/remote.mjs';

// Usage: node scripts/refresh-dev.mjs
// Makes staging a fresh copy of production, so it can be edited and tested
// without touching www. Staging has its own database (DEV_DB_*) since
// 2026-09-29; before that both sites shared one and a test edit went live.
//
//   1. Copies every table of the www database (DB_*) into the staging one
//      (DEV_DB_*), replacing what was there.
//   2. Empties the form tables on staging: they hold personal data from real
//      visitors, which a test database has no reason to keep.
//   3. Sends every staging form notification to DEV_MAIL_TO, so a test never
//      emails the client.
//   4. Copies to staging any image uploaded on www that it doesn't have yet.
//
// Only ever writes to staging; www is read, never changed.

const FORM_TABLES = ['denuncias', 'job_applications', 'presupuesto_requests', 'cliente_requests', 'desistimiento_requests'];
const FORMS = ['candidatura', 'denuncia', 'presupuesto', 'cliente', 'desistimiento'];

const missing = ['DB_HOST', 'DB_NAME', 'DEV_DB_HOST', 'DEV_DB_NAME', 'DEV_DB_USER', 'DEV_DB_PASS', 'DEV_MAIL_TO']
  .filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing in .env: ${missing.join(', ')}`);
  process.exit(1);
}
if (process.env.DEV_DB_NAME === process.env.DB_NAME) {
  console.error('DEV_DB_NAME is the production database. Refusing.');
  process.exit(1);
}

const open = (p) => mysql.createConnection({
  host: process.env[`${p}HOST`], user: process.env[`${p}USER`], password: process.env[`${p}PASS`],
  database: process.env[`${p}NAME`], ssl: { rejectUnauthorized: false }, charset: 'utf8mb4', dateStrings: true,
  // JSON columns (ambientes.specs, tiendas.emails) as their raw text: parsed into
  // objects, the INSERT below would expand them into `key` = value pairs.
  typeCast: (field, next) => (field.type === 'JSON' ? field.string('utf8') : next()),
});

// ---- 1. Database ----
const prod = await open('DB_');
const dev = await open('DEV_DB_');
const tables = (await prod.query('SHOW TABLES'))[0].map((r) => Object.values(r)[0]);
await dev.query('SET FOREIGN_KEY_CHECKS = 0');
for (const t of tables) {
  const [[{ 'Create Table': ddl }]] = await prod.query(`SHOW CREATE TABLE \`${t}\``);
  await dev.query(`DROP TABLE IF EXISTS \`${t}\``);
  await dev.query(ddl);
  if (FORM_TABLES.includes(t)) continue;
  const [rows] = await prod.query({ sql: `SELECT * FROM \`${t}\``, rowsAsArray: true });
  for (let i = 0; i < rows.length; i += 200) {
    await dev.query(`INSERT INTO \`${t}\` VALUES ?`, [rows.slice(i, i + 200)]);
  }
  console.log(`  ${t}: ${rows.length} rows`);
}
await dev.query('SET FOREIGN_KEY_CHECKS = 1');
console.log(`  ${FORM_TABLES.join(', ')}: left empty`);

// ---- 3. Form recipients ----
for (const form of FORMS) {
  await dev.query(
    'INSERT INTO site_settings (id, `key`, value) VALUES (UUID(), ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
    [`mail_to_${form}`, process.env.DEV_MAIL_TO],
  );
}
console.log('  staging form notifications -> DEV_MAIL_TO');
await prod.end();
await dev.end();

// ---- 4. Media ----
const sftp = await connect();
let copied = 0;
try {
  const walk = async (rel) => {
    await sftp.mkdir(`${DEV_ROOT}/media${rel}`, true);
    for (const it of await sftp.list(`${PROD_ROOT}/media${rel}`)) {
      const path = `${rel}/${it.name}`;
      if (it.type === 'd') {
        if (path !== '/cvs') await walk(path); // CVs are personal data: never copied
        continue;
      }
      const there = await sftp.stat(`${DEV_ROOT}/media${path}`).catch(() => null);
      if (there && there.size === it.size) continue;
      await sftp.put(await sftp.get(`${PROD_ROOT}/media${path}`), `${DEV_ROOT}/media${path}`);
      copied++;
    }
  };
  await walk('');
} finally {
  await sftp.end();
}
console.log(`  media: ${copied} file(s) copied from www`);
console.log('Staging refreshed from www.');
