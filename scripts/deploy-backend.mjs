import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes } from 'node:crypto';

// Uploads the PHP backend + migration payload to /html/dev:
//   server/api/*        -> /html/dev/api/
//   server/sql/         -> /html/dev/sql/   (+ deny .htaccess)
//   server/media/.htaccess -> /html/dev/media/
//   migration-data/media/* -> /html/dev/media/
//   migration-data/*.json  -> /html/dev/api/import/
// And generates + uploads api/config.php from .env values:
//   DB_NAME, DB_USER, DB_PASS, DB_HOST (opt), RESEND_API_KEY (opt), SETUP_TOKEN (auto)

const ROOT = resolve(import.meta.dirname, '..');
const REMOTE = '/html/dev';

const required = ['DB_NAME', 'DB_USER', 'DB_PASS'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing in .env: ${missing.join(', ')}`);
  process.exit(1);
}

let setupToken = process.env.SETUP_TOKEN;
if (!setupToken) {
  setupToken = randomBytes(24).toString('hex');
  await writeFile(resolve(ROOT, '.env'), `SETUP_TOKEN=${setupToken}\n`, { flag: 'a' });
  console.log('Generated SETUP_TOKEN and appended it to .env');
}

const phpEscape = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const configPhp = `<?php
define('DB_HOST', '${phpEscape(process.env.DB_HOST || 'localhost')}');
define('DB_NAME', '${phpEscape(process.env.DB_NAME)}');
define('DB_USER', '${phpEscape(process.env.DB_USER)}');
define('DB_PASS', '${phpEscape(process.env.DB_PASS)}');
define('SMTP_HOST', '${phpEscape(process.env.SMTP_HOST || '')}');
define('SMTP_PORT', '${phpEscape(process.env.SMTP_PORT || '465')}');
define('SMTP_SECURE', '${phpEscape(process.env.SMTP_SECURE || 'ssl')}');
define('SMTP_USER', '${phpEscape(process.env.SMTP_USER || '')}');
define('SMTP_PASS', '${phpEscape(process.env.SMTP_PASS || '')}');
define('MAIL_FROM', '${phpEscape(process.env.MAIL_FROM || 'Web <web@saneamientos-pereda.com>')}');
define('MAIL_TO', '${phpEscape(process.env.MAIL_TO || 'ines@saneamientos-pereda.com')}');
define('SETUP_TOKEN', '${phpEscape(setupToken)}');
`;

const sftp = new SftpClient();
try {
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: Number(process.env.SFTP_PORT) || 22,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
    readyTimeout: 20000,
    tryKeyboard: true,
  });

  await sftp.mkdir(`${REMOTE}/api/import`, true);
  await sftp.mkdir(`${REMOTE}/sql`, true);
  await sftp.mkdir(`${REMOTE}/media`, true);

  console.log('Uploading PHP API...');
  await sftp.uploadDir(resolve(ROOT, 'server/api'), `${REMOTE}/api`);
  await sftp.put(Buffer.from(configPhp), `${REMOTE}/api/config.php`);

  console.log('Uploading schema...');
  await sftp.uploadDir(resolve(ROOT, 'server/sql'), `${REMOTE}/sql`);
  await sftp.put(Buffer.from('Require all denied\n'), `${REMOTE}/sql/.htaccess`);

  console.log('Uploading media protection + migrated media...');
  await sftp.put(resolve(ROOT, 'server/media/.htaccess'), `${REMOTE}/media/.htaccess`);
  if (existsSync(resolve(ROOT, 'migration-data/media'))) {
    await sftp.uploadDir(resolve(ROOT, 'migration-data/media'), `${REMOTE}/media`);
  }

  console.log('Uploading import data...');
  const tables = [
    'products', 'product_photos', 'brands', 'ambientes', 'ambiente_photos',
    'tiendas', 'tienda_photos', 'site_settings',
    'denuncias', 'job_applications', 'presupuesto_requests', 'cliente_requests',
  ];
  for (const t of tables) {
    const f = resolve(ROOT, `migration-data/${t}.json`);
    if (existsSync(f)) await sftp.put(f, `${REMOTE}/api/import/${t}.json`);
  }

  console.log('Backend deploy complete.');
  console.log(`Setup: POST http://dev.saneamientos-pereda.com/api/setup.php with the token in .env`);
} finally {
  await sftp.end();
}
