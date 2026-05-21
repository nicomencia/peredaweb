/*
  # Add sold column to products table

  1. Changes
    - Add `sold` boolean column to `products` table
    - Set default value to `false` (product is not sold by default)
    - Column is NOT NULL to ensure data consistency

  2. Notes
    - This column will track whether a product has been sold
    - Existing products will automatically be marked as not sold
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sold'
  ) THEN
    ALTER TABLE products ADD COLUMN sold boolean NOT NULL DEFAULT false;
  END IF;
END $$;