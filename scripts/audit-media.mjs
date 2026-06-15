import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';

// Recursively lists /html/dev/media with sizes, so we can compare against
// what the DB actually references and prune orphans.
const ROOT = '/html/dev/media';
const sftp = new SftpClient();

async function walk(dir, depth = 0) {
  const list = await sftp.list(dir);
  for (const item of list.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = `${dir}/${item.name}`;
    if (item.type === 'd') {
      console.log('  '.repeat(depth) + `[${item.name}]`);
      await walk(path, depth + 1);
    } else {
      console.log('  '.repeat(depth) + `${item.name}  (${(item.size / 1024).toFixed(0)} KB)  ${path}`);
    }
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
  await walk(ROOT);
} finally {
  await sftp.end();
}
