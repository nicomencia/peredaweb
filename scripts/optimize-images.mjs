import sharp from 'sharp';
import { readdir, stat, rename } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';

// Recompress images in public/ in place: resize to a sane max width and
// re-encode (JPEG q78 / PNG max compression). Originals are recoverable from git.
const dir = resolve(import.meta.dirname, '../public');
const MAX_WIDTH = 1920;

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const name of files) {
  try {
    await processFile(name);
  } catch (err) {
    console.log(`${name}: SKIPPED (${err.message.split('\n')[0]})`);
  }
}

async function processFile(name) {
  const file = join(dir, name);
  const before = (await stat(file)).size;
  const img = sharp(file);
  const meta = await img.metadata();

  let pipeline = img;
  if (meta.width > MAX_WIDTH) pipeline = pipeline.resize({ width: MAX_WIDTH });

  const ext = extname(name).toLowerCase();
  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else {
    pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true });
  }

  const tmp = file + '.tmp';
  await pipeline.toFile(tmp);
  const after = (await stat(tmp)).size;

  if (after < before) {
    await rename(tmp, file);
    console.log(`${name}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB (${meta.width}px${meta.width > MAX_WIDTH ? ` -> ${MAX_WIDTH}px` : ''})`);
  } else {
    const { rm } = await import('node:fs/promises');
    await rm(tmp);
    console.log(`${name}: kept original (${(before / 1024).toFixed(0)} KB)`);
  }
}

