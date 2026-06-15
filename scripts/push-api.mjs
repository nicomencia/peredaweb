import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// Uploads PHP code + schema + import JSON to /html/dev (NOT media, NOT config.php).
// Fast iteration path for backend code changes; config.php stays as deployed.
const ROOT = resolve(import.meta.dirname, '..');
const REMOTE = '/html/dev';

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

  // API .php files (skip config.php so we never clobber server credentials)
  for (const f of await readdir(resolve(ROOT, 'server/api'))) {
    if (f === 'config.php') continue;
    await sftp.put(resolve(ROOT, 'server/api', f), `${REMOTE}/api/${f}`);
  }
  // Schema
  await sftp.put(resolve(ROOT, 'server/sql/schema.sql'), `${REMOTE}/sql/schema.sql`);

  console.log('API + schema pushed.');
} finally {
  await sftp.end();
}
