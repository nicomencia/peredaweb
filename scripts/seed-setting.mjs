import 'dotenv/config';
import mysql from 'mysql2/promise';
import { randomUUID } from 'node:crypto';
import { dbConfig } from './lib/remote.mjs';

// Inserts a site_settings key if it doesn't exist (INSERT IGNORE never clobbers
// an existing value), in www's database and, when configured, staging's: a key
// missing on one side makes that admin's save silently do nothing.
// Usage: node scripts/seed-setting.mjs <key> [value]
const [key, value = ''] = process.argv.slice(2);
if (!key) {
  console.error('Usage: node scripts/seed-setting.mjs <key> [value]');
  process.exit(1);
}

for (const prod of process.env.DEV_DB_NAME ? [true, false] : [true]) {
  const conn = await mysql.createConnection(dbConfig(prod));
  const [r] = await conn.execute(
    'INSERT IGNORE INTO site_settings (id, `key`, value) VALUES (?, ?, ?)',
    [randomUUID(), key, value]
  );
  const where = prod ? 'www' : 'staging';
  console.log(r.affectedRows === 1 ? `${where}: seeded ${key} = ${JSON.stringify(value)}` : `${where}: ${key} already exists (kept)`);
  await conn.end();
}
