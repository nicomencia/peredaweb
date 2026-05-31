/*
  # Add general settings: footer, colors, and secondary logo

  1. New Data in site_settings
    - Footer:
      - `footer_description` - Brand description text in the footer
      - `footer_facebook_url` - Facebook URL
      - `footer_instagram_url` - Instagram URL
    - Colors:
      - `color_primary` - Primary brand color (used as --color-blue)
      - `color_secondary` - Secondary/cream color (used as --color-cream)
      - `color_dark` - Dark text color (used as --color-black)
    - Logo:
      - `navbar_logo` - Logo shown in the navbar and footer

  2. Notes
    - Uses ON CONFLICT to avoid duplicates
    - Default values match current hardcoded values
*/

INSERT INTO site_settings (key, value) VALUES
  ('footer_description', 'Especialistas en equipamiento de baño desde 1985. Empresa familiar con más de 35 años de experiencia ofreciendo productos de alta calidad y servicio profesional.'),
  ('footer_facebook_url', 'https://facebook.com/Pereda.Asturias'),
  ('footer_instagram_url', 'https://instagram.com/saneamientospereda/'),
  ('color_primary', '#002FA7'),
  ('color_secondary', '#F8F6F4'),
  ('color_dark', '#1A1A1A'),
  ('navbar_logo', '/logo.png')
ON CONFLICT (key) DO NOTHING;
