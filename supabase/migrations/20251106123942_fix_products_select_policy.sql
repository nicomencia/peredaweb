/*
  # Fix Products SELECT Policy

  The current policy only allows anonymous users to view products.
  We need to allow both anonymous and authenticated users to view products.

  Changes:
  - Drop the existing SELECT policy
  - Create a new policy that allows both anon and authenticated roles
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Create new policy that works for both anon and authenticated users
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);