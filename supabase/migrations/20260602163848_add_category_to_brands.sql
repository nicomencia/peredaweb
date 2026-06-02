/*
  # Add category to brands

  1. Modified Tables
    - `brands`
      - Added `category` (text) - links brand to a product category (nullable means it shows on the main page)

  2. Notes
    - Brands with a null category will display on the main Productos page
    - Brands with a specific category value will display on that category's page
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'brands' AND column_name = 'category'
  ) THEN
    ALTER TABLE brands ADD COLUMN category text DEFAULT NULL;
  END IF;
END $$;
