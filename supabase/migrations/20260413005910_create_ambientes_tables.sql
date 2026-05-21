/*
  # Create ambientes tables

  1. New Tables
    - `ambientes`
      - `id` (uuid, primary key)
      - `title` (text) - Name of the ambiente (e.g., "Ambiente 1")
      - `summary` (text) - Short description shown on the card
      - `description` (text) - Full description shown on detail page
      - `cover_image_url` (text) - Main image URL
      - `display_order` (integer) - Order of display
      - `created_at` (timestamptz)
    - `ambiente_photos`
      - `id` (uuid, primary key)
      - `ambiente_id` (uuid, foreign key to ambientes)
      - `image_url` (text) - Photo URL
      - `caption` (text) - Optional caption
      - `display_order` (integer) - Order of display
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for both tables (content is public-facing)
    - Authenticated users can manage data (insert, update, delete)
*/

CREATE TABLE IF NOT EXISTS ambientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cover_image_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ambientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ambientes"
  ON ambientes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ambientes"
  ON ambientes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update ambientes"
  ON ambientes FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete ambientes"
  ON ambientes FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS ambiente_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ambiente_id uuid NOT NULL REFERENCES ambientes(id) ON DELETE CASCADE,
  image_url text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ambiente_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ambiente photos"
  ON ambiente_photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ambiente photos"
  ON ambiente_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update ambiente photos"
  ON ambiente_photos FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete ambiente photos"
  ON ambiente_photos FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
