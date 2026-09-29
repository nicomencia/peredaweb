import { connect, remoteRoot, isProd } from './lib/remote.mjs';

// Usage: node scripts/push-config.mjs [--prod]
// Regenerates api/config.php from .env and uploads only that file, to /html/dev
// or, with --prod, /html.
// Fast path for tweaking DB_HOST / credentials without re-deploying media.
//
// Staging has its own database since 2026-09-29: it uses DEV_DB_* and sends its
// fallback notifications to DEV_MAIL_TO. Production uses DB_* and MAIL_TO.
const prod = isProd();
const env = (key) => process.env[prod ? key : `DEV_${key}`];
const missing = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'MAIL_TO'].filter((k) => !env(k));
if (missing.length) {
  console.error(`Missing in .env for ${prod ? 'production' : 'staging'}: ${missing.map((k) => (prod ? k : `DEV_${k}`)).join(', ')}`);
  process.exit(1);
}
if (!prod && env('DB_NAME') === process.env.DB_NAME) {
  console.error('DEV_DB_NAME is the production database: staging must have its own. Refusing.');
  process.exit(1);
}

const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const defs = [
  ['DB_HOST', env('DB_HOST')],
  ['DB_NAME', env('DB_NAME')],
  ['DB_USER', env('DB_USER')],
  ['DB_PASS', env('DB_PASS')],
  ['SMTP_HOST', process.env.SMTP_HOST || ''],
  ['SMTP_PORT', process.env.SMTP_PORT || '465'],
  ['SMTP_SECURE', process.env.SMTP_SECURE || 'ssl'],
  ['SMTP_USER', process.env.SMTP_USER || ''],
  ['SMTP_PASS', process.env.SMTP_PASS || ''],
  ['MAIL_FROM', process.env.MAIL_FROM || 'Web <web@saneamientos-pereda.com>'],
  ['MAIL_TO', env('MAIL_TO')],
  ['SETUP_TOKEN', process.env.SETUP_TOKEN || ''],
];
const php = '<?php\n' + defs.map(([k, v]) => `define('${k}', '${esc(v)}');`).join('\n') + '\n';

const REMOTE = remoteRoot();
const sftp = await connect();
try {
  await sftp.mkdir(`${REMOTE}/api`, true);
  await sftp.put(Buffer.from(php), `${REMOTE}/api/config.php`);
  console.log(`${REMOTE}/api/config.php updated (database ${env('DB_NAME')} on ${env('DB_HOST')})`);
} finally {
  await sftp.end();
}
