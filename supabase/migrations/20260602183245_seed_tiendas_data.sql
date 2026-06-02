/*
  # Seed tiendas table with existing store data

  Migrates the 4 hardcoded stores from Instalaciones.jsx into the database:
    1. Oviedo - C/Independencia
    2. Oviedo - C/La Lila
    3. Pruvia - Ctra. AS-266
    4. Gijon - C/Infiesto
*/

INSERT INTO tiendas (name, address, postal_code, phone, hours_tienda, hours_fontaneria, hours_sabados, hours_verano, emails, lat, lon, display_order)
VALUES
  (
    'Oviedo',
    'C/Independencia, 43',
    '33004 Oviedo',
    '985 271 026',
    '09:30 – 13:30 y 16:00 – 20:00',
    '08:30 – 13:30 y 15:00 – 19:00',
    '10:00 – 13:30 (abierto sólo Tienda Exposición)',
    '(sábados de julio y agosto cerrado)',
    ARRAY['expoind@saneamientos-pereda.com', 'independenciaalmacen@saneamientos-pereda.com'],
    43.3623,
    -5.8447,
    1
  ),
  (
    'Oviedo',
    'C/La Lila, 26 – Avellanos 4',
    '33002 Oviedo',
    '985 223 489',
    '10:00 – 13:30 y 16:00 – 20:00',
    '08:30 – 13:30 y 15:00 – 19:00',
    '10:00 – 13:30',
    '(sábados de julio y agosto cerrado)',
    ARRAY['expolila@saneamientos-pereda.com', 'lilaalmacen@saneamientos-pereda.com'],
    43.3614,
    -5.8586,
    2
  ),
  (
    'Pruvia',
    'Ctra. AS-266 km 6,5',
    '33192 Pruvia',
    '985 260 124',
    '10:00 – 13:30 y 16:00 – 20:00',
    '08.00 – 20:00',
    '10:00 – 14:00',
    '(sábados de julio y agosto cerrado)',
    ARRAY['expopruvia@saneamientos-pereda.com', 'pruviacash@saneamientos-pereda.com', 'pruviacons@saneamientos-pereda.com', 'logistica@saneamientos-pereda.com'],
    43.4156,
    -5.9328,
    3
  ),
  (
    'Gijón',
    'C/Infiesto, 12/14 – Avilés 17',
    '33207 Gijón',
    '985 351 747',
    '10:00 – 13:30 y 16:00 – 20:00',
    '08:00 – 13:30 y 15:00 – 19:00',
    '10:00 – 13:30',
    '(sábados de julio y agosto cerrado)',
    ARRAY['expogijon@saneamientos-pereda.com', 'gijonalmacen@saneamientos-pereda.com'],
    43.5322,
    -5.6611,
    4
  );
