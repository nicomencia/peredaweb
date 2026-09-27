import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { connect, remoteRoot } from './lib/remote.mjs';

// Usage: node scripts/push-api.mjs [--prod]
// Uploads PHP code + schema to /html/dev, or /html with --prod (NOT media, NOT
// config.php — config.php stays as deployed; see push-config.mjs).
// setup.php is never uploaded: it DROPs every table and must stay off the server.
// A fresh re-import is the one exception - see docs/RUNBOOK.md.
const ROOT = resolve(import.meta.dirname, '..');
const REMOTE = remoteRoot();

const sftp = await connect();
try {
  await sftp.mkdir(`${REMOTE}/api`, true);
  await sftp.mkdir(`${REMOTE}/sql`, true);

  // API .php files + api/.htaccess (skip config.php so we never clobber server credentials)
  for (const f of await readdir(resolve(ROOT, 'server/api'))) {
    if (f === 'config.php' || f === 'setup.php') continue;
    await sftp.put(resolve(ROOT, 'server/api', f), `${REMOTE}/api/${f}`);
  }
  // Schema (only ever read server-side, so the folder is closed to the web)
  await sftp.put(resolve(ROOT, 'server/sql/schema.sql'), `${REMOTE}/sql/schema.sql`);
  await sftp.put(Buffer.from('Require all denied\n'), `${REMOTE}/sql/.htaccess`);
  // Uploads folder: never execute scripts from it
  await sftp.mkdir(`${REMOTE}/media`, true);
  await sftp.put(resolve(ROOT, 'server/media/.htaccess'), `${REMOTE}/media/.htaccess`);

  console.log(`API + schema pushed to ${REMOTE}.`);
} finally {
  await sftp.end();
}
