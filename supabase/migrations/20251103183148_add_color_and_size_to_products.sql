/*
  # Add color and size columns to products table

  1. Changes
    - Add `color` column (text) to store the color/material description
    - Add `size` column (integer) to store the ring size (talla)
  
  2. Notes
    - Color will store values like "Solan de Cabras (azul)", "Papel", "MIX", etc.
    - Size is only applicable to rings (Anillos), will be NULL for other product types
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'color'
  ) THEN
    ALTER TABLE products ADD COLUMN color text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size'
  ) THEN
    ALTER TABLE products ADD COLUMN size integer;
  END IF;
END $$;