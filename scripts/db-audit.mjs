import 'dotenv/config';
import mysql from 'mysql2/promise';

// Read-only audit of the live MySQL: row counts, form-table contents (to spot
// test rows), and every /media/ path referenced (to find orphan files).
const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

const [tables] = await conn.query('SHOW TABLES');
const tableNames = tables.map((r) => Object.values(r)[0]);

console.log('=== ROW COUNTS ===');
for (const t of tableNames) {
  const [[{ n }]] = await conn.query(`SELECT COUNT(*) n FROM \`${t}\``);
  console.log(`  ${t}: ${n}`);
}

console.log('\n=== FORM TABLE CONTENTS (look for test rows) ===');
for (const t of ['denuncias', 'presupuesto_requests', 'cliente_requests', 'job_applications']) {
  const [rows] = await conn.query(`SELECT * FROM \`${t}\``);
  if (!rows.length) { console.log(`  ${t}: (empty)`); continue; }
  for (const r of rows) {
    const label = r.pin ? `pin=${r.pin}` : `${r.nombre || ''} <${r.email || ''}>`;
    console.log(`  ${t}: id=${r.id} | ${label} | ${r.created_at}`);
  }
}

console.log('\n=== /media REFERENCES IN DB ===');
const referenced = new Set();
const cols = {
  products: ['image_url', 'secondary_image_url', 'thumbnail_url'],
  product_photos: ['image_url'],
  brands: ['logo_url'],
  ambientes: ['cover_image_url'],
  ambiente_photos: ['image_url'],
  tiendas: ['cover_image_url'],
  tienda_photos: ['image_url'],
  site_settings: ['value'],
};
for (const [t, cs] of Object.entries(cols)) {
  if (!tableNames.includes(t)) continue;
  const [rows] = await conn.query(`SELECT ${cs.map((c) => `\`${c}\``).join(',')} FROM \`${t}\``);
  for (const r of rows) for (const c of cs) {
    const v = r[c];
    if (typeof v === 'string' && v.includes('/media/')) referenced.add(v.trim());
  }
}
[...referenced].sort().forEach((u) => console.log('  ' + u));
console.log(`  (total referenced: ${referenced.size})`);

await conn.end();
