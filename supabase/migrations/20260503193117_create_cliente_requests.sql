/*
  # Create cliente_requests table

  1. New Tables
    - `cliente_requests`
      - `id` (uuid, primary key)
      - `nombre` (text) - full name
      - `empresa` (text) - company name
      - `cif` (text) - tax id
      - `localidad` (text) - locality
      - `telefono` (text) - phone
      - `email` (text) - email
      - `actividad` (text) - professional activity
      - `mensaje` (text) - additional message
      - `created_at` (timestamptz) - submission timestamp

  2. Security
    - Enable RLS
    - Allow anonymous + authenticated users to INSERT only
    - No public SELECT policy; reads restricted to service role
*/

CREATE TABLE IF NOT EXISTS cliente_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL DEFAULT '',
  empresa text NOT NULL DEFAULT '',
  cif text NOT NULL DEFAULT '',
  localidad text NOT NULL DEFAULT '',
  telefono text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  actividad text NOT NULL DEFAULT '',
  mensaje text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cliente_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit cliente request (anon)"
  ON cliente_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can submit cliente request (authenticated)"
  ON cliente_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
