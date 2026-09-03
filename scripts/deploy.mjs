import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Usage: node scripts/deploy.mjs [remoteDir]
// Uploads the local dist/ build to the given remote directory (default: $SFTP_REMOTE_DIR).
const localDir = resolve(import.meta.dirname, '../dist');
const remoteDir = process.argv[2] || process.env.SFTP_REMOTE_DIR;

if (!existsSync(localDir)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}
// The remote dir must be an absolute POSIX path. This also catches Git Bash
// (MSYS) rewriting a POSIX argument into a Windows path: "/html/dev" arrives
// as "C:/Program Files/Git/html/dev", which is not absolute, so it would be
// taken as relative to the SFTP home and quietly deploy into a junk tree.
if (!remoteDir || !remoteDir.startsWith('/')) {
  console.error('Refusing to deploy: the remote directory must be an absolute path starting with "/", got ' + JSON.stringify(remoteDir) + '.');
  console.error('From Git Bash on Windows use PowerShell instead, or prefix the command with MSYS_NO_PATHCONV=1.');
  process.exit(1);
}

const target = remoteDir.replace(/\/+$/, '');
if (target === '' || target === '/html') {
  console.error('Refusing to deploy to ' + JSON.stringify(remoteDir) + ' — that is the server root or the live WordPress docroot.');
  process.exit(1);
}

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
  await sftp.mkdir(remoteDir, true);
  console.log(`Uploading ${localDir} -> ${remoteDir} ...`);
  await sftp.uploadDir(localDir, remoteDir);
  console.log('Deploy complete.');
} finally {
  await sftp.end();
}
