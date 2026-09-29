import { connect, remoteRoot } from './lib/remote.mjs';

// Recursively lists the staging media folder (www's with --prod) with sizes, so
// we can compare against what the DB actually references and prune orphans.
const ROOT = `${remoteRoot()}/media`;
let sftp;

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
  sftp = await connect();
  await walk(ROOT);
} finally {
  await sftp?.end();
}
