import { connect, remoteRoot, positional, isProd, wordpressInProd } from './lib/remote.mjs';

// Deletes specific files that were removed locally (deploy only adds/overwrites,
// never deletes). Paths are relative to /html/dev, or /html with --prod.
const REMOTE = remoteRoot();
const targets = positional();
if (!targets.length) {
  console.error('Usage: node scripts/prune-deployed.mjs [--prod] <file> [file...]');
  process.exit(1);
}

const sftp = await connect();
try {
  // Before go-live, /html is the old WordPress: nothing to prune there.
  if (isProd() && (await wordpressInProd(sftp))) {
    console.error('Refusing to delete from /html: WordPress is still there.');
    process.exit(1);
  }
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
