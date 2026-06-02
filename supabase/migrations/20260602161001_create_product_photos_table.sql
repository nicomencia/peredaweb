/*
  # Create product_photos table for multiple images per product

  1. New Tables
    - `product_photos`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `image_url` (text, the photo URL)
      - `display_order` (integer, for ordering photos)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `product_photos` table
    - Public read access (photos are displayed on the public site)
    - Authenticated users can manage photos (admin)
*/

CREATE TABLE IF NOT EXISTS product_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product photos"
  ON product_photos
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert product photos"
  ON product_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update product photos"
  ON product_photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete product photos"
  ON product_photos
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_product_photos_product_id ON product_photos(product_id);
CREATE INDEX IF NOT EXISTS idx_product_photos_order ON product_photos(product_id, display_order);
