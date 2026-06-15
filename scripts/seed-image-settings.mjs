import 'dotenv/config';
import mysql from 'mysql2/promise';
import { randomUUID } from 'node:crypto';

// Seeds site_settings rows for the images that became DB-driven, pointing at the
// current base images (served from the web root). INSERT IGNORE: never overwrites
// a value the admin has already set (key is UNIQUE).
const SEEDS = {
  // Quiénes somos
  quienes_somos_bg: '/quienessomos.jpg',
  quienes_somos_1: '/quienessomos1.jpg',
  quienes_somos_2: '/quienessomos2.jpg',
  quienes_somos_3: '/quienessomos3.jpg',
  quienes_somos_4: '/quienessomos4.jpg',
  // Área profesional
  area_profesional_bg: '/fondo.jpg',
  // Category banners (one per category; corrupt "construccion" replaced by bano)
  category_banner_bano: '/productos_bano.jpg',
  category_banner_sanitarios: '/productos_bano.jpg',
  category_banner_griferia: '/productos_bano.jpg',
  'category_banner_muebles-bano': '/productos_bano.jpg',
  category_banner_climatizacion: '/productos_fontaneria.png',
  category_banner_fontaneria: '/productos_fontaneria.png',
  category_banner_ceramica: '/productos_bano.jpg',
  category_banner_materiales: '/productos_bano.jpg',
  category_banner_mamparas: '/productos_bano.jpg',
  category_banner_herramientas: '/productos_bano.jpg',
  category_banner_electricidad: '/productos_bano.jpg',
};

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

let inserted = 0, kept = 0;
for (const [key, value] of Object.entries(SEEDS)) {
  const [res] = await conn.execute(
    'INSERT IGNORE INTO site_settings (id, `key`, value) VALUES (?, ?, ?)',
    [randomUUID(), key, value]
  );
  if (res.affectedRows === 1) { inserted++; console.log(`+ ${key} = ${value}`); }
  else { kept++; console.log(`= ${key} (already set, kept)`); }
}
console.log(`\nSeeded ${inserted} new, kept ${kept} existing.`);
await conn.end();
