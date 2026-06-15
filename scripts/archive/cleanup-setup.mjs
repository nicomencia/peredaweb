import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';

// Post-migration cleanup: remove the one-time importer, its payload, and any
// test uploads from the server. Safe to run repeatedly.
const REMOTE = '/html/dev';
const sftp = new SftpClient();

async function rmIfExists(path, isDir) {
  try {
    if (isDir) await sftp.rmdir(path, true);
    else await sftp.delete(path);
    console.log(`removed ${path}`);
  } catch {
    console.log(`(absent) ${path}`);
  }
}

try {
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: Number(process.env.SFTP_PORT) || 22,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
    readyTimeout: 20000,
    tryKeyboard: true,
  });
  await rmIfExists(`${REMOTE}/api/setup.php`, false);
  await rmIfExists(`${REMOTE}/api/import`, true);
  await rmIfExists(`${REMOTE}/media/test`, true);
} finally {
  await sftp.end();
}
