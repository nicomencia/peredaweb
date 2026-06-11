import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';

const sftp = new SftpClient();
const dir = process.argv[2] || '/';

try {
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: Number(process.env.SFTP_PORT) || 22,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
    readyTimeout: 20000,
    tryKeyboard: true,
  });
  const list = await sftp.list(dir);
  for (const item of list) {
    const size = item.type === 'd' ? '' : ` (${item.size} B)`;
    console.log(`${item.type === 'd' ? 'DIR ' : 'FILE'} ${dir.replace(/\/$/, '')}/${item.name}${size}`);
  }
} finally {
  await sftp.end();
}
