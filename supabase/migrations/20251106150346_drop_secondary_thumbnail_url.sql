/*
  # Remove secondary thumbnail column

  1. Changes
    - Drop `secondary_thumbnail_url` column from `products` table
    - This column is no longer needed as only primary images use thumbnails
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'secondary_thumbnail_url'
  ) THEN
    ALTER TABLE products DROP COLUMN secondary_thumbnail_url;
  END IF;
END $$;