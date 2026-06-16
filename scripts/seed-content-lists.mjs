import 'dotenv/config';
import mysql from 'mysql2/promise';
import { randomUUID } from 'node:crypto';

// Seeds the JSON-list content settings with their current defaults so the admin
// editor shows existing items. INSERT IGNORE never overwrites edited values.
const SEEDS = {
  inspirate_heading: 'Inspírate',
  area_features: JSON.stringify([
    { title: 'Calidad garantizada', text: 'Trabajamos solo con las mejores marcas del sector para garantizar resultados profesionales' },
    { title: 'Stock permanente', text: 'Amplio inventario disponible para que nunca te falte material en tus proyectos' },
    { title: 'Precios profesionales', text: 'Condiciones especiales y descuentos exclusivos para instaladores profesionales' },
    { title: 'Asesoramiento experto', text: 'Nuestro equipo te asesora personalmente en cada proyecto que emprendas' },
  ]),
  quienes_stats: JSON.stringify([
    { number: '+50', label: 'Años de Experiencia', description: 'Siempre con una constante dedicación para mejorar los servicios al cliente y una continua actualización de productos e instalaciones.' },
    { number: '+40', label: 'Profesionales Especializados', description: 'Nuestro personal está formado por profesionales cualificados que te asesorarán y atenderán personalmente.' },
  ]),
  pidecita_locations: JSON.stringify([
    { name: 'Pruvia', phone: '984 497 255', email: 'pedidos@saneamientos-pereda.com' },
    { name: 'Oviedo (c/Independencia)', phone: '984 392 779', email: 'expoind@saneamientos-pereda.com' },
    { name: 'Oviedo (c/La Lila)', phone: '984 491 168', email: 'expolila@saneamientos-pereda.com' },
    { name: 'Gijón', phone: '984 392 248', email: 'expogijon@saneamientos-pereda.com' },
  ]),
};

const conn = await mysql.createConnection({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS,
  database: process.env.DB_NAME, ssl: { rejectUnauthorized: false },
});
for (const [key, value] of Object.entries(SEEDS)) {
  const [r] = await conn.execute(
    'INSERT IGNORE INTO site_settings (id, `key`, value) VALUES (?, ?, ?)',
    [randomUUID(), key, value]
  );
  console.log(r.affectedRows === 1 ? `+ ${key}` : `= ${key} (kept)`);
}
await conn.end();
