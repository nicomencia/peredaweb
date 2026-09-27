import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';
const sftp = new SftpClient();
await sftp.connect({ host: process.env.SFTP_HOST, port: +process.env.SFTP_PORT || 22,
  username: process.env.SFTP_USER, password: process.env.SFTP_PASS, readyTimeout: 20000, tryKeyboard: true });
// 1. can we run commands?
await new Promise((res) => sftp.client.exec('echo hi; which tar mysqldump zip', (err, stream) => {
  if (err) { console.log('exec: NO (' + err.message + ')'); return res(); }
  let out = ''; stream.on('data', d => out += d).stderr.on('data', d => out += d);
  stream.on('close', (code) => { console.log('exec: code', code, JSON.stringify(out)); res(); });
}));
// 2. size of /html excluding dev and copia1.zip
const top = {}; let files = 0;
async function walk(dir, key) {
  for (const it of await sftp.list(dir)) {
    const p = dir + '/' + it.name;
    const k = key || it.name;
    if (!key && (it.name === 'dev' || it.name === 'copia1.zip')) continue;
    if (it.type === 'd') await walk(p, k);
    else { top[k] = (top[k] || 0) + it.size; files++; }
  }
}
await walk('/html', null);
const tot = Object.values(top).reduce((a, b) => a + b, 0);
for (const [k, v] of Object.entries(top).sort((a, b) => b[1] - a[1])) console.log((v / 1e6).toFixed(1).padStart(9), 'MB ', k);
console.log('TOTAL', (tot / 1e6).toFixed(1), 'MB in', files, 'files');
await sftp.end();
