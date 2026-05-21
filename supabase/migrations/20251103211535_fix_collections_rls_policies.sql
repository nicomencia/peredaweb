/*
  # Fix Collections RLS Policies

  1. Changes
    - Drop existing restrictive policy
    - Add comprehensive SELECT policy for both anon and authenticated users
    - Ensure collections are publicly readable

  2. Security
    - Collections remain publicly readable
    - No changes to write permissions
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Collections are viewable by everyone" ON collections;

-- Create new policy for public read access
CREATE POLICY "Enable read access for all users"
  ON collections
  FOR SELECT
  USING (true);
