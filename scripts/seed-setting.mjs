import 'dotenv/config';
import mysql from 'mysql2/promise';
import { randomUUID } from 'node:crypto';

// Inserts a site_settings key if it doesn't exist (INSERT IGNORE never clobbers
// an existing value). Usage: node scripts/seed-setting.mjs <key> [value]
const [key, value = ''] = process.argv.slice(2);
if (!key) {
  console.error('Usage: node scripts/seed-setting.mjs <key> [value]');
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS,
  database: process.env.DB_NAME, ssl: { rejectUnauthorized: false },
});
const [r] = await conn.execute(
  'INSERT IGNORE INTO site_settings (id, `key`, value) VALUES (?, ?, ?)',
  [randomUUID(), key, value]
);
console.log(r.affectedRows === 1 ? `seeded ${key} = ${JSON.stringify(value)}` : `${key} already exists (kept)`);
await conn.end();
