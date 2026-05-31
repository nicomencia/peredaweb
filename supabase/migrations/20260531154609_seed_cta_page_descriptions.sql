/*
  # Add page description settings for the 4 CTA pages

  1. New Data
    - `cta_1_description` - Intro text for Pide Cita page
    - `cta_2_description` - Intro text for Financiacion page
    - `cta_3_description` - Intro text for Presupuesto page
    - `cta_4_description` - Intro text for Hazte Cliente page

  2. Notes
    - Uses ON CONFLICT to avoid duplicates
    - Default values match current hardcoded text
*/

INSERT INTO site_settings (key, value) VALUES
  ('cta_1_description', 'Te ofrecemos la posibilidad de solicitar cita previa antes de acudir a nuestro establecimiento, podrás beneficiarte de una atención personalizada en tus proyectos de reformas y además evitar tiempos de espera.'),
  ('cta_2_description', 'Saneamientos Pereda pone a tu disposición una línea de financiación con unas condiciones inmejorables: todas tus compras al 0% DE INTERÉS en cuotas de hasta 24 meses.'),
  ('cta_3_description', 'Más de 50 años de experiencia. Más de 40 profesionales especializados en diferentes áreas del sector. Locales de exposición y autoservicio. Venta a profesionales del gremio y a particulares. Líderes del mercado Asturiano.'),
  ('cta_4_description', 'Condiciones y precios especiales para profesionales. Asesoramiento técnico personalizado. Amplio stock disponible para entrega inmediata. Servicio de reparto en Asturias. Atención preferente en nuestras exposiciones.')
ON CONFLICT (key) DO NOTHING;
