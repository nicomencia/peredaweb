/*
  # Create presupuesto_requests table

  1. New Tables
    - `presupuesto_requests`
      - `id` (uuid, primary key)
      - `nombre` (text) - requester's name
      - `localidad` (text) - locality/city
      - `email` (text) - contact email
      - `asunto` (text) - subject of the request
      - `mensaje` (text) - body of the request
      - `created_at` (timestamptz) - submission timestamp

  2. Security
    - Enable RLS on `presupuesto_requests`
    - Allow anonymous and authenticated users to INSERT only
    - No SELECT policy is defined; reads are restricted to service-role / admin contexts
*/

CREATE TABLE IF NOT EXISTS presupuesto_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL DEFAULT '',
  localidad text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  asunto text NOT NULL DEFAULT '',
  mensaje text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE presupuesto_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a presupuesto request (anon)"
  ON presupuesto_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can submit a presupuesto request (authenticated)"
  ON presupuesto_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
