import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';

// Deletes specific files from /html/dev that were removed locally (deploy only
// adds/overwrites, never deletes). Pass paths relative to /html/dev as args.
const REMOTE = '/html/dev';
const targets = process.argv.slice(2);
if (!targets.length) {
  console.error('Usage: node scripts/prune-deployed.mjs <file> [file...]');
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
  for (const rel of targets) {
    const path = `${REMOTE}/${rel.replace(/^\/+/, '')}`;
    try {
      await sftp.delete(path);
      console.log(`removed ${path}`);
    } catch {
      console.log(`(absent) ${path}`);
    }
  }
} finally {
  await sftp.end();
}
