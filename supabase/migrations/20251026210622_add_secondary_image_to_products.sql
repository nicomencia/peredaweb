/*
  # Add secondary image field to products table

  1. Changes
    - Add `secondary_image_url` column to products table
      - Type: text
      - Default: empty string
      - Nullable: false
    
  2. Notes
    - This allows each product to have two images
    - Existing products will have an empty string for secondary_image_url
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'secondary_image_url'
  ) THEN
    ALTER TABLE products ADD COLUMN secondary_image_url text DEFAULT '' NOT NULL;
  END IF;
END $$;