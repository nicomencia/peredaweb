import 'dotenv/config';
import sharp from 'sharp';
import mysql from 'mysql2/promise';
import SftpClient from 'ssh2-sftp-client';
import { randomBytes } from 'node:crypto';
import { resolve, posix } from 'node:path';

// Compresses specific oversized media files: resize to <=1920px, re-encode WebP,
// upload under a NEW filename (avoids the hosting's static cache), repoint every
// DB reference, then delete the original. Source files come from migration-data/.
const MAX = 1920;
const REMOTE_ROOT = '/html/dev';
const LOCAL_MEDIA = resolve(import.meta.dirname, '../migration-data/media');

const TARGETS = [
  '/media/site-assets/site-assets/1780423936917-0upffo.jpg',
  '/media/site-assets/ambientes/164add62-30de-444f-948e-ec3abae987b5/1780999082300-3je1hw.JPG',
];

// table -> columns that may contain a /media URL (same map as db-audit)
const REF_COLUMNS = {
  products: ['image_url', 'secondary_image_url', 'thumbnail_url'],
  product_photos: ['image_url'],
  brands: ['logo_url'],
  ambientes: ['cover_image_url'],
  ambiente_photos: ['image_url'],
  tiendas: ['cover_image_url'],
  tienda_photos: ['image_url'],
  site_settings: ['value'],
};

const conn = await mysql.createConnection({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS,
  database: process.env.DB_NAME, ssl: { rejectUnauthorized: false },
});
const sftp = new SftpClient();
await sftp.connect({
  host: process.env.SFTP_HOST, port: Number(process.env.SFTP_PORT) || 22,
  username: process.env.SFTP_USER, password: process.env.SFTP_PASS,
  readyTimeout: 20000, tryKeyboard: true,
});

try {
  for (const oldUrl of TARGETS) {
    const rel = oldUrl.replace(/^\/media\//, '');           // site-assets/.../x.jpg
    const localPath = resolve(LOCAL_MEDIA, rel);
    const dir = posix.dirname(rel);                          // site-assets/...
    const newName = `${Date.now()}_${randomBytes(4).toString('hex')}.webp`;
    const newUrl = `/media/${dir}/${newName}`;

    const before = (await sharp(localPath).metadata());
    const buf = await sharp(localPath)
      .rotate()
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    await sftp.put(buf, `${REMOTE_ROOT}${newUrl}`);

    let refs = 0;
    for (const [table, cols] of Object.entries(REF_COLUMNS)) {
      for (const col of cols) {
        const [res] = await conn.execute(
          `UPDATE \`${table}\` SET \`${col}\` = ? WHERE \`${col}\` = ?`, [newUrl, oldUrl]
        );
        refs += res.affectedRows;
      }
    }

    await sftp.delete(`${REMOTE_ROOT}${oldUrl}`).catch(() => {});

    const origKB = Math.round((await sftp.stat(`${REMOTE_ROOT}${newUrl}`)).size / 1024);
    console.log(`${oldUrl}`);
    console.log(`  ${before.width}x${before.height} -> webp, ${refs} DB ref(s) updated`);
    console.log(`  new: ${newUrl} (${origKB} KB)`);
  }
} finally {
  await sftp.end();
  await conn.end();
}
