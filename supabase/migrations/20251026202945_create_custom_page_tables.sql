/*
  # Create custom page tables

  1. New Tables
    - `flowers`
      - `id` (uuid, primary key)
      - `image_url` (text) - URL to the flower image
      - `alt_text` (text) - Alternative text for the image
      - `display_order` (integer) - Order in which to display the flower
      - `created_at` (timestamptz)
    
    - `accessory_types`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the accessory type (e.g., "Pendiente de aro")
      - `image_url` (text) - URL to the accessory type image
      - `display_order` (integer) - Order in which to display the accessory type
      - `created_at` (timestamptz)
    
    - `plastic_colors`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the plastic color (e.g., "Solán de Cabras (azul)")
      - `image_url` (text) - URL to the color sample image
      - `display_order` (integer) - Order in which to display the color
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add public read policies for all tables (these are display-only content)
*/

CREATE TABLE IF NOT EXISTS flowers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE flowers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view flowers"
  ON flowers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS accessory_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accessory_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view accessory types"
  ON accessory_types FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS plastic_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plastic_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plastic colors"
  ON plastic_colors FOR SELECT
  TO anon, authenticated
  USING (true);
