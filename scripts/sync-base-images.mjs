import 'dotenv/config';
import mysql from 'mysql2/promise';
import SftpClient from 'ssh2-sftp-client';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Pulls the current above-the-fold brand images from the DB/media into public/base/
// as fixed-name WebP files, so they bundle with the build and paint instantly on
// first load — while the DB stays the source of truth. Run before `npm run deploy`.
// Resilient: on any failure it leaves the existing public/base files untouched.
const PUBLIC_BASE = resolve(import.meta.dirname, '../public/base');
const REMOTE_ROOT = '/html/dev';

// setting key -> stable bundled filename (always .webp)
const MAP = {
  navbar_logo: 'navbar-logo.webp',
  hero_logo: 'hero-logo.webp',
  hero_background: 'hero-bg.webp',
};

let conn, sftp;
try {
  conn = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false },
  });
  const [rows] = await conn.query(
    "SELECT `key`, value FROM site_settings WHERE `key` IN ('navbar_logo','hero_logo','hero_background')"
  );

  sftp = new SftpClient();
  await sftp.connect({
    host: process.env.SFTP_HOST, port: Number(process.env.SFTP_PORT) || 22,
    username: process.env.SFTP_USER, password: process.env.SFTP_PASS,
    readyTimeout: 20000, tryKeyboard: true,
  });
  await mkdir(PUBLIC_BASE, { recursive: true });

  for (const { key, value } of rows) {
    const out = MAP[key];
    if (!out || !value || !value.startsWith('/media/')) continue;
    const src = await sftp.get(`${REMOTE_ROOT}${value}`);
    const webp = await sharp(src)
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();
    await writeFile(resolve(PUBLIC_BASE, out), webp);
    console.log(`${key}: ${value} -> public/base/${out} (${Math.round(webp.length / 1024)} KB)`);
  }
} catch (err) {
  console.error('sync-base-images skipped (keeping existing files):', err.message);
} finally {
  if (sftp) await sftp.end();
  if (conn) await conn.end();
}
