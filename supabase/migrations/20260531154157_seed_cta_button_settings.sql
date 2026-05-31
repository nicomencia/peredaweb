/*
  # Seed CTA button settings

  1. New Data
    - Adds 8 rows to `site_settings` for the 4 homepage CTA buttons:
      - `cta_1_title` - Title text for button 1
      - `cta_1_label` - Button label for button 1
      - `cta_2_title` - Title text for button 2
      - `cta_2_label` - Button label for button 2
      - `cta_3_title` - Title text for button 3
      - `cta_3_label` - Button label for button 3
      - `cta_4_title` - Title text for button 4
      - `cta_4_label` - Button label for button 4

  2. Notes
    - Uses ON CONFLICT to avoid duplicates if re-run
    - Default values match existing hardcoded texts
*/

INSERT INTO site_settings (key, value) VALUES
  ('cta_1_title', 'Pide cita para tus proyectos de reformas'),
  ('cta_1_label', 'PIDE CITA'),
  ('cta_2_title', 'Financiación sin intereses'),
  ('cta_2_label', 'CONSULTA NUESTRA FINANCIACIÓN'),
  ('cta_3_title', 'Asesoramiento y servicio post venta'),
  ('cta_3_label', 'SOLICITA PRESUPUESTO'),
  ('cta_4_title', 'Conoce las ventajas para el profesional'),
  ('cta_4_label', 'HAZTE CLIENTE')
ON CONFLICT (key) DO NOTHING;
