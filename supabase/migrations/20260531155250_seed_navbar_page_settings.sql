/*
  # Add page content settings for navbar pages

  1. New Data in site_settings
    - Quienes Somos page:
      - `quienes_intro_1` - First paragraph of the intro
      - `quienes_intro_2` - Second paragraph of the intro
      - `quienes_subtitle` - Hero subtitle
    - Inspirate page:
      - `inspirate_card_1_title` - First card title
      - `inspirate_card_1_text` - First card text
      - `inspirate_card_2_title` - Second card title
      - `inspirate_card_2_text` - Second card text
      - `inspirate_card_3_title` - Third card title
      - `inspirate_card_3_text` - Third card text
    - Tiendas (Instalaciones) page:
      - `tiendas_banner_title` - CTA banner title
      - `tiendas_banner_button` - CTA banner button text
    - Productos page:
      - `productos_subtitle` - Products page subtitle
    - Area Profesional page:
      - `area_hero_title` - Hero title
      - `area_hero_subtitle` - Hero subtitle
      - `area_benefits_title` - Benefits section title
      - `area_benefits_subtitle` - Benefits section subtitle

  2. Notes
    - Uses ON CONFLICT to avoid duplicates
    - Default values match existing hardcoded texts
*/

INSERT INTO site_settings (key, value) VALUES
  ('quienes_subtitle', 'Siempre con dedicación para mejorar nuestros servicios'),
  ('quienes_intro_1', 'Saneamientos Pereda es una empresa familiar fundada en Oviedo en el año 1959. Nace como distribuidora de productos de fontanería y sanitarios, pero con el paso de los años, con esfuerzo y dedicación, y gracias a la confianza depositada por los clientes, ha sabido crecer y diversificar su oferta para adaptarse a las necesidades del mercado, convirtiéndose en un referente en su sector.'),
  ('quienes_intro_2', 'La oferta de productos, dirigida tanto al profesional como al particular más exigente, abarca material de fontanería, calefacción, sanitarios, grifería, mobiliario y accesorios para baño, materiales de construcción, electricidad, pintura, jardinería y herramienta.'),
  ('inspirate_card_1_title', 'Visítanos'),
  ('inspirate_card_1_text', 'En nuestras tiendas encontrarás diferentes ambientes de baño, cerámicas y productos de decoración con una cuidada selección de marcas donde escoger el producto que mejor se adapte a tus necesidades.'),
  ('inspirate_card_2_title', 'Hacemos realidad tus proyectos'),
  ('inspirate_card_2_text', 'Te ayudamos en tus proyectos de reformas. Ven a vernos, dinos lo que necesitas y lo planificamos juntos. No esperes más y pide cita en cualquiera de nuestras tiendas.'),
  ('inspirate_card_3_title', 'Confía en nuestra experiencia'),
  ('inspirate_card_3_text', 'Ofrecemos las mejores soluciones para tu hogar. Contamos con una larga trayectoria profesional, un equipo experimentado y somos líderes en el mercado asturiano.'),
  ('tiendas_banner_title', 'Pide cita para tus proyectos de reformas'),
  ('tiendas_banner_button', 'PIDE CITA'),
  ('productos_subtitle', 'Descubre nuestra amplia gama de productos para tu hogar y proyectos profesionales'),
  ('area_hero_title', 'Todo para el instalador'),
  ('area_hero_subtitle', 'Tu aliado en cada instalación. Calidad, stock y asesoramiento para profesionales.'),
  ('area_benefits_title', 'Beneficios diseñados para profesionales'),
  ('area_benefits_subtitle', 'Porque aquí encuentras calidad al mejor precio, un amplio stock con primeras marcas, el mejor asesoramiento personalizado y, además, todas las novedades y ofertas al alcance de tu mano.')
ON CONFLICT (key) DO NOTHING;
