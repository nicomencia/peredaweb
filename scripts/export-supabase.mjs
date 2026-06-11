import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { resolve, dirname } from 'node:path';

// Exports all publicly readable Supabase tables to migration-data/*.json and
// downloads every storage image they reference into migration-data/media/.
const BASE = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;
const OUT = resolve(import.meta.dirname, '../migration-data');

const TABLES = [
  'products', 'product_photos', 'brands',
  'ambientes', 'ambiente_photos',
  'tiendas', 'tienda_photos', 'site_settings',
  // Form tables — likely blocked for anon SELECT; exported best-effort.
  'denuncias', 'job_applications', 'presupuesto_requests', 'cliente_requests',
];

const STORAGE_PREFIX = `${BASE}/storage/v1/object/public/`;
const mediaUrls = new Set();

function collectUrls(value) {
  if (typeof value === 'string' && value.startsWith(STORAGE_PREFIX)) mediaUrls.add(value);
  else if (Array.isArray(value)) value.forEach(collectUrls);
  else if (value && typeof value === 'object') Object.values(value).forEach(collectUrls);
}

await mkdir(OUT, { recursive: true });

for (const table of TABLES) {
  const res = await fetch(`${BASE}/rest/v1/${table}?select=*&limit=10000`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) {
    console.log(`${table}: SKIPPED (HTTP ${res.status})`);
    continue;
  }
  const rows = await res.json();
  collectUrls(rows);
  await writeFile(`${OUT}/${table}.json`, JSON.stringify(rows, null, 2));
  console.log(`${table}: ${rows.length} rows`);
}

console.log(`\nDownloading ${mediaUrls.size} storage files...`);
let ok = 0, failed = 0;
for (const url of mediaUrls) {
  const relPath = decodeURIComponent(url.slice(STORAGE_PREFIX.length)); // e.g. site-assets/products/xx.webp
  const dest = resolve(OUT, 'media', relPath);
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) { console.log(`  FAILED ${res.status}: ${relPath}`); failed++; continue; }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  ok++;
}
console.log(`Media: ${ok} downloaded, ${failed} failed.`);
