/*
  # Add product_type column to products

  1. Modified Tables
    - `products`
      - Added `product_type` (text) - categorizes products into: bano, fontaneria, materiales
      - Defaults to 'bano' for existing rows

  2. Notes
    - This column allows filtering products by the three main categories:
      Bano, Fontaneria y calefaccion, Materiales de construccion
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'product_type'
  ) THEN
    ALTER TABLE products ADD COLUMN product_type text NOT NULL DEFAULT 'bano';
  END IF;
END $$;