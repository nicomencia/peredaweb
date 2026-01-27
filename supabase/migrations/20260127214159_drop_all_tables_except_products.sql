/*
  # Drop all tables except products

  1. Changes
    - Remove foreign key constraint from products.collection_id
    - Drop collection_details table
    - Drop collection_photos table
    - Drop collections table
    - Drop flowers table
    - Drop accessory_types table
    - Drop plastic_colors table

  2. Notes
    - Only the products table will remain in the database
    - All data in the dropped tables will be permanently deleted
*/

ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_collection_id_fkey;

DROP TABLE IF EXISTS collection_details CASCADE;
DROP TABLE IF EXISTS collection_photos CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS flowers CASCADE;
DROP TABLE IF EXISTS accessory_types CASCADE;
DROP TABLE IF EXISTS plastic_colors CASCADE;

ALTER TABLE IF EXISTS products DROP COLUMN IF EXISTS collection_id;
