import { connect, remoteRoot } from './lib/remote.mjs';

// Usage: node scripts/push-config.mjs [--prod]
// Regenerates api/config.php from .env and uploads only that file, to /html/dev
// or, with --prod, /html.
// Fast path for tweaking DB_HOST / credentials without re-deploying media.
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const defs = [
  ['DB_HOST', process.env.DB_HOST || 'localhost'],
  ['DB_NAME', process.env.DB_NAME],
  ['DB_USER', process.env.DB_USER],
  ['DB_PASS', process.env.DB_PASS],
  ['SMTP_HOST', process.env.SMTP_HOST || ''],
  ['SMTP_PORT', process.env.SMTP_PORT || '465'],
  ['SMTP_SECURE', process.env.SMTP_SECURE || 'ssl'],
  ['SMTP_USER', process.env.SMTP_USER || ''],
  ['SMTP_PASS', process.env.SMTP_PASS || ''],
  ['MAIL_FROM', process.env.MAIL_FROM || 'Web <web@saneamientos-pereda.com>'],
  ['MAIL_TO', process.env.MAIL_TO || 'ines@saneamientos-pereda.com'],
  ['SETUP_TOKEN', process.env.SETUP_TOKEN || ''],
];
const php = '<?php\n' + defs.map(([k, v]) => `define('${k}', '${esc(v)}');`).join('\n') + '\n';

const REMOTE = remoteRoot();
const sftp = await connect();
try {
  await sftp.mkdir(`${REMOTE}/api`, true);
  await sftp.put(Buffer.from(php), `${REMOTE}/api/config.php`);
  console.log(`${REMOTE}/api/config.php updated (DB_HOST=${process.env.DB_HOST})`);
} finally {
  await sftp.end();
}
