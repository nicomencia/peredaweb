/*
  # Pereda Studio Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text) - Anillos, Pendientes, Colgantes, Pinzas de pelo
      - `price` (numeric)
      - `image_url` (text)
      - `collection_id` (uuid, nullable, foreign key)
      - `featured` (boolean)
      - `created_at` (timestamptz)
    
    - `collections`
      - `id` (uuid, primary key)
      - `name` (text) - La Playa, El Jardín
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `image_url` (text)
      - `published_date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (no auth required for browsing)
*/

CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  collection_id uuid REFERENCES collections(id),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  published_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are viewable by everyone"
  ON collections FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "News are viewable by everyone"
  ON news FOR SELECT
  TO anon
  USING (true);
