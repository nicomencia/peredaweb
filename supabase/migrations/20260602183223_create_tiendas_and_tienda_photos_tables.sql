/*
  # Create tiendas (stores) and tienda_photos tables

  1. New Tables
    - `tiendas`
      - `id` (uuid, primary key)
      - `name` (text) - Store city/name
      - `address` (text) - Street address
      - `postal_code` (text) - Postal code and city
      - `phone` (text) - Phone number
      - `hours_tienda` (text) - Tienda Exposicion hours
      - `hours_fontaneria` (text) - Fontaneria y Construccion hours
      - `hours_sabados` (text) - Saturday hours
      - `hours_verano` (text) - Summer hours note
      - `emails` (text[]) - Array of email addresses
      - `lat` (double precision) - Latitude
      - `lon` (double precision) - Longitude
      - `cover_image_url` (text) - Main store image
      - `display_order` (integer) - Display ordering
      - `created_at` (timestamptz)

    - `tienda_photos`
      - `id` (uuid, primary key)
      - `tienda_id` (uuid, foreign key to tiendas)
      - `image_url` (text) - Photo URL
      - `display_order` (integer) - Display ordering
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public SELECT for viewing stores on the website
    - Authenticated INSERT/UPDATE/DELETE for admin management
*/

CREATE TABLE IF NOT EXISTS tiendas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  hours_tienda text NOT NULL DEFAULT '',
  hours_fontaneria text NOT NULL DEFAULT '',
  hours_sabados text NOT NULL DEFAULT '',
  hours_verano text NOT NULL DEFAULT '',
  emails text[] NOT NULL DEFAULT '{}',
  lat double precision NOT NULL DEFAULT 0,
  lon double precision NOT NULL DEFAULT 0,
  cover_image_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tiendas"
  ON tiendas FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tiendas"
  ON tiendas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tiendas"
  ON tiendas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tiendas"
  ON tiendas FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS tienda_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tienda_id uuid NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tienda_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tienda photos"
  ON tienda_photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tienda photos"
  ON tienda_photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tienda photos"
  ON tienda_photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tienda photos"
  ON tienda_photos FOR DELETE
  TO authenticated
  USING (true);
