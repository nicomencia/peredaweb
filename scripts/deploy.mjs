import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { connect, remoteRoot, isProd, positional, DEV_ROOT, wordpressInProd } from './lib/remote.mjs';

// Usage: npm run deploy              -> staging    (/html/dev)
//        npm run deploy -- --prod    -> production (/html)
// Uploads the local dist/ build. Only adds/overwrites; see prune-deployed.mjs.
const localDir = resolve(import.meta.dirname, '../dist');
const remoteDir = remoteRoot();

// The old form `npm run deploy /html/dev` still works. Any other positional
// argument is refused - including what Git Bash (MSYS) makes of "/html/dev":
// "C:/Program Files/Git/html/dev", which would deploy into a junk tree.
const [legacyDir] = positional();
if (legacyDir && legacyDir.replace(/\/+$/, '') !== DEV_ROOT) {
  console.error(`Refusing to deploy to ${JSON.stringify(legacyDir)}. Use \`npm run deploy\` (staging) or \`npm run deploy -- --prod\` (production).`);
  console.error('From Git Bash on Windows, run deploys from PowerShell instead.');
  process.exit(1);
}

if (!existsSync(localDir)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const sftp = await connect();
try {
  // Until go-live, /html is the live WordPress: this upload would replace its
  // index.php and .htaccess. The switch itself is scripts/go-live.mjs.
  if (isProd() && (await wordpressInProd(sftp))) {
    console.error('Refusing to deploy to /html: WordPress is still there. Use scripts/go-live.mjs.');
    process.exit(1);
  }
  await sftp.mkdir(remoteDir, true);
  console.log(`Uploading ${localDir} -> ${remoteDir} ...`);
  await sftp.uploadDir(localDir, remoteDir);
  console.log('Deploy complete.');
} finally {
  await sftp.end();
}
