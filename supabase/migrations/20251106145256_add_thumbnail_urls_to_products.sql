/*
  # Add Thumbnail URLs to Products

  1. Changes
    - Add `thumbnail_url` column to `products` table for optimized grid display
    - Add `secondary_thumbnail_url` column for optimized hover images
    - These thumbnails will be lower resolution versions for faster loading in grid views
    - Full resolution images remain in `image_url` and `secondary_image_url` for lightbox display

  2. Notes
    - Thumbnails should be generated at approximately 400x400px for optimal grid performance
    - Existing products will need thumbnails generated and uploaded
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE products ADD COLUMN thumbnail_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'secondary_thumbnail_url'
  ) THEN
    ALTER TABLE products ADD COLUMN secondary_thumbnail_url text;
  END IF;
END $$;