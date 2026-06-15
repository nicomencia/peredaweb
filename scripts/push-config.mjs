import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';

// Regenerates /html/dev/api/config.php from .env and uploads only that file.
// Fast path for tweaking DB_HOST / credentials without re-deploying media.
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const defs = [
  ['DB_HOST', process.env.DB_HOST || 'localhost'],
  ['DB_NAME', process.env.DB_NAME],
  ['DB_USER', process.env.DB_USER],
  ['DB_PASS', process.env.DB_PASS],
  ['RESEND_API_KEY', process.env.RESEND_API_KEY || ''],
  ['MAIL_FROM', process.env.MAIL_FROM || 'Web <web@saneamientos-pereda.com>'],
  ['MAIL_TO', process.env.MAIL_TO || 'ines@saneamientos-pereda.com'],
  ['SETUP_TOKEN', process.env.SETUP_TOKEN || ''],
];
const php = '<?php\n' + defs.map(([k, v]) => `define('${k}', '${esc(v)}');`).join('\n') + '\n';

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
  await sftp.put(Buffer.from(php), '/html/dev/api/config.php');
  console.log(`config.php updated (DB_HOST=${process.env.DB_HOST})`);
} finally {
  await sftp.end();
}
