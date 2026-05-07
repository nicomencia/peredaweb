/*
  # Fix Security Issues

  This migration addresses several security and performance issues:

  1. Foreign Key Indexes
    - Add index on `collection_details.collection_id`
    - Add index on `collection_photos.collection_id`
    - Add index on `products.collection_id`

  2. Duplicate Policies
    - Remove duplicate SELECT policy on `products` table
    - Keep only "Products are viewable by everyone"

  3. Unused Index
    - Remove `idx_products_display_order` as it's not being used

  These changes improve query performance and clean up security policies.
*/

-- Add indexes for foreign keys to improve query performance
CREATE INDEX IF NOT EXISTS idx_collection_details_collection_id 
  ON collection_details(collection_id);

CREATE INDEX IF NOT EXISTS idx_collection_photos_collection_id 
  ON collection_photos(collection_id);

CREATE INDEX IF NOT EXISTS idx_products_collection_id 
  ON products(collection_id);

-- Drop unused index
DROP INDEX IF EXISTS idx_products_display_order;

-- Remove duplicate SELECT policy (keeping "Products are viewable by everyone")
DROP POLICY IF EXISTS "Anyone can view products" ON products;