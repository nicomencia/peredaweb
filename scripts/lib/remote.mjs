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

// MySQL connection options for one environment. Production and staging have
// separate databases since 2026-09-29 (DB_* and DEV_DB_* in .env), so a script
// that pairs a database with a media folder must take both from the same side.
export function dbConfig(prod) {
  const p = prod ? 'DB_' : 'DEV_DB_';
  if (!process.env[`${p}NAME`]) throw new Error(`Missing ${p}NAME in .env`);
  return {
    host: process.env[`${p}HOST`], user: process.env[`${p}USER`], password: process.env[`${p}PASS`],
    database: process.env[`${p}NAME`], ssl: { rejectUnauthorized: false },
  };
}

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
