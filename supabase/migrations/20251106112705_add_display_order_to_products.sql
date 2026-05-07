/*
  # Add display_order column to products table

  1. Changes
    - Add `display_order` column to products table (integer type)
    - Set default value to 0
    - Create index on display_order for efficient sorting

  2. Notes
    - Display order will be populated in subsequent update queries
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE products ADD COLUMN display_order integer DEFAULT 0;
    CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
  END IF;
END $$;
