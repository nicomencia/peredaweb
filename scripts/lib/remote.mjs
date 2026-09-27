import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';

// Where the deploy scripts write. Staging (/html/dev) unless the command line
// says --prod, so production is never the accident.
export const DEV_ROOT = '/html/dev';
export const PROD_ROOT = '/html';

export const isProd = (argv = process.argv) => argv.includes('--prod');
export const remoteRoot = (argv = process.argv) => (isProd(argv) ? PROD_ROOT : DEV_ROOT);
// Positional arguments without the flags.
export const positional = (argv = process.argv) => argv.slice(2).filter((a) => !a.startsWith('--'));

export async function connect() {
  const sftp = new SftpClient();
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: Number(process.env.SFTP_PORT) || 22,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
    readyTimeout: 20000,
    tryKeyboard: true,
  });
  return sftp;
}

// True while the old WordPress still occupies /html. Anything that would write
// the site's entry points (index.php, .htaccess) there must refuse until then;
// scripts/go-live.mjs is the only thing that swaps them.
export const wordpressInProd = (sftp) => sftp.exists(`${PROD_ROOT}/wp-config.php`).then(Boolean);
