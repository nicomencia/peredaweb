import 'dotenv/config';
import sharp from 'sharp';
import mysql from 'mysql2/promise';
import SftpClient from 'ssh2-sftp-client';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

// One-time: moves the base images that DB settings still reference in /public into
// the managed /media store, then repoints every DB reference. Afterwards the app
// is fully DB/media-driven and the public/ copies can be deleted.
const PUBLIC = resolve(import.meta.dirname, '../public');
const REMOTE_BASE = '/html/dev/media/base';

// public file -> { remote webp name, the old URL the DB currently uses }
const IMAGES = [
  { file: 'fondo.jpg', out: 'fondo.webp', oldUrl: '/fondo.jpg' },
  { file: 'productos_bano.jpg', out: 'productos_bano.webp', oldUrl: '/productos_bano.jpg' },
  { file: 'productos_fontaneria.png', out: 'productos_fontaneria.webp', oldUrl: '/productos_fontaneria.png' },
  { file: 'quienessomos.jpg', out: 'quienessomos.webp', oldUrl: '/quienessomos.jpg' },
  { file: 'quienessomos1.jpg', out: 'quienessomos1.webp', oldUrl: '/quienessomos1.jpg' },
  { file: 'quienessomos2.jpg', out: 'quienessomos2.webp', oldUrl: '/quienessomos2.jpg' },
  { file: 'quienessomos3.jpg', out: 'quienessomos3.webp', oldUrl: '/quienessomos3.jpg' },
  { file: 'quienessomos4.jpg', out: 'quienessomos4.webp', oldUrl: '/quienessomos4.jpg' },
  { file: 'tienda.jpg', out: 'tienda.webp', oldUrl: '/tienda.jpg' },
];
// Favicon stays a PNG (broad compatibility); copied as-is.
const FAVICON = { file: 'logo.png', out: 'logo.png' };

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
  await sftp.mkdir(REMOTE_BASE, true);

  for (const { file, out, oldUrl } of IMAGES) {
    const buf = await sharp(resolve(PUBLIC, file))
      .rotate()
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const newUrl = `/media/base/${out}`;
    await sftp.put(buf, `/html/dev/media/base/${out}`);

    let refs = 0;
    for (const [table, cols] of Object.entries(REF_COLUMNS)) {
      for (const col of cols) {
        const [r] = await conn.execute(
          `UPDATE \`${table}\` SET \`${col}\` = ? WHERE \`${col}\` = ?`, [newUrl, oldUrl]
        );
        refs += r.affectedRows;
      }
    }
    console.log(`${oldUrl} -> ${newUrl}  (${Math.round(buf.length / 1024)} KB, ${refs} ref(s))`);
  }

  // Favicon
  await sftp.put(await readFile(resolve(PUBLIC, FAVICON.file)), `/html/dev/media/base/${FAVICON.out}`);
  console.log(`favicon -> /media/base/${FAVICON.out}`);

  // Stores with no cover -> the migrated default
  const [r] = await conn.execute(
    "UPDATE tiendas SET cover_image_url = '/media/base/tienda.webp' WHERE cover_image_url IS NULL OR cover_image_url = ''"
  );
  console.log(`tienda covers set: ${r.affectedRows}`);
} finally {
  await sftp.end();
  await conn.end();
}
