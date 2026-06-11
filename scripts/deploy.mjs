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
if (!remoteDir || remoteDir === '/') {
  console.error('Refusing to deploy: set a remote directory (arg or SFTP_REMOTE_DIR), and never "/".');
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
