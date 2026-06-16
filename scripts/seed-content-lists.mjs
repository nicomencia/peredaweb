import 'dotenv/config';
import mysql from 'mysql2/promise';
import { randomUUID } from 'node:crypto';

// Seeds the JSON-list content settings with their current defaults so the admin
// editor shows existing items. INSERT IGNORE never overwrites edited values.
const SEEDS = {
  inspirate_heading: 'Inspírate',
  quienes_caption_1: 'Nuestros orígenes',
  quienes_caption_2: 'Nuestras instalaciones',
  quienes_servicios_title: 'Servicios asociados',
  quienes_servicios_subtitle: 'Nuestros especialistas en diseño de interiores te acompañarán en cada paso para ayudarte a crear el baño que siempre has imaginado.',
  quienes_porque_title: '¿POR QUÉ ELEGIR SANEAMIENTOS PEREDA?',
  quienes_equipo_title: 'NUESTRO EQUIPO',
  quienes_equipo_subtitle: 'Las personas que hacen posible Saneamientos Pereda',
  quienes_careers_title: 'TRABAJA CON NOSOTROS',
  quienes_careers_text: '¿Quieres formar parte de nuestro equipo? Envíanos tu CV.',
  quienes_careers_button: 'Enviar CV',
  quienes_servicios: JSON.stringify([
    { name: 'Asesoramiento profesional', text: 'Contamos con un equipo de expertos en interiorismo y decoración que te orientará para encontrar las mejores soluciones según tu espacio, estilo y necesidades.' },
    { name: 'Diseño personalizado', text: 'Te ayudamos a elegir la opción que mejor encaje contigo. Y si buscas algo único, elaboramos propuestas totalmente a medida adaptadas a tu proyecto.' },
    { name: 'Transporte a domicilio', text: 'Olvídate de las preocupaciones logísticas. Nos encargamos de llevar tu compra directamente hasta tu hogar de forma cómoda y segura.' },
    { name: 'Financiación flexible', text: 'Si lo necesitas, ponemos a tu disposición diferentes opciones de financiación para que puedas realizar tu proyecto con mayor comodidad.' },
    { name: 'Recogida rápida', text: 'Compra cómodamente y recoge tu pedido sin esperas y con total facilidad.' },
  ]),
  quienes_porque: JSON.stringify([
    { text: 'Todo para reformar el baño' },
    { text: 'Te ayudamos a diseñarlo' },
    { text: 'Trato humano y personalizado' },
    { text: 'Más de 50 años de experiencia en el sector' },
    { text: 'Los mejores precios del mercado' },
    { text: 'Garantía Postventa' },
  ]),
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
