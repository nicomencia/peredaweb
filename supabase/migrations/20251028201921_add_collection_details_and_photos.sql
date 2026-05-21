/*
  # Add Collection Details and Photos Tables

  1. New Tables
    - `collection_details`
      - `id` (uuid, primary key)
      - `collection_id` (uuid, foreign key to collections)
      - `description_text` (text) - Full description text for the collection detail page
      - `created_at` (timestamptz)
    
    - `collection_photos`
      - `id` (uuid, primary key)
      - `collection_id` (uuid, foreign key to collections)
      - `image_url` (text) - URL of the photo
      - `display_order` (integer) - Order for displaying photos
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (collections are public content)
*/

CREATE TABLE IF NOT EXISTS collection_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  description_text text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collection_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collection details"
  ON collection_details FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view collection photos"
  ON collection_photos FOR SELECT
  TO anon, authenticated
  USING (true);