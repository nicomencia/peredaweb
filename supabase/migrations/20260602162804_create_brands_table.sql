/*
  # Create brands table

  1. New Tables
    - `brands`
      - `id` (uuid, primary key)
      - `name` (text) - brand name for alt text
      - `logo_url` (text) - URL to the brand logo image
      - `display_order` (integer) - controls carousel order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `brands` table
    - Public read access for all users (logos are public content)
    - Authenticated users can insert, update, delete (admin)
*/

CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  logo_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brands"
  ON brands FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert brands"
  ON brands FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update brands"
  ON brands FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete brands"
  ON brands FOR DELETE
  TO authenticated
  USING (true);
