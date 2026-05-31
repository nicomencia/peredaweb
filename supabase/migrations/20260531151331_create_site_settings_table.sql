/*
  # Create site_settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - setting identifier (e.g. 'hero_logo', 'hero_background')
      - `value` (text) - the setting value (URL or other string)
      - `updated_at` (timestamptz) - last modification timestamp

  2. Security
    - Enable RLS on `site_settings` table
    - Public SELECT policy for all users (settings are displayed publicly)
    - INSERT/UPDATE/DELETE restricted to authenticated users (admin)

  3. Initial Data
    - Seed default hero_logo and hero_background values
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site settings"
  ON site_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Seed default values
INSERT INTO site_settings (key, value) VALUES
  ('hero_logo', '/logo_letras.png'),
  ('hero_background', '/fondo.jpg')
ON CONFLICT (key) DO NOTHING;
