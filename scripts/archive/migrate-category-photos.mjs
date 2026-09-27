import 'dotenv/config';
import mysql from 'mysql2/promise';
import { randomUUID } from 'node:crypto';

// One-off: seed `category_photos_<key>` (JSON array) from the legacy single
// `category_banner_<key>` setting, so the new category carousel starts with the
// image the client already uploaded. Never clobbers an existing photos list.
const conn = await mysql.createConnection({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS,
  database: process.env.DB_NAME, ssl: { rejectUnauthorized: false },
});

const [banners] = await conn.execute(
  "SELECT `key`, value FROM site_settings WHERE `key` LIKE 'category_banner_%'"
);

let seeded = 0;
for (const row of banners) {
  const cat = row.key.replace('category_banner_', '');
  const photosKey = `category_photos_${cat}`;
  if (!row.value) continue;
  const [r] = await conn.execute(
    'INSERT IGNORE INTO site_settings (id, `key`, value) VALUES (?, ?, ?)',
    [randomUUID(), photosKey, JSON.stringify([row.value])]
  );
  if (r.affectedRows === 1) {
    seeded++;
    console.log(`seeded ${photosKey} = [${row.value}]`);
  } else {
    console.log(`${photosKey} already exists (kept)`);
  }
}

console.log(`Done. ${seeded} category photo list(s) seeded.`);
await conn.end();
