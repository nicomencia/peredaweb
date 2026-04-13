/*
  # Create complaints (denuncias) channel tables

  1. New Tables
    - `denuncias`
      - `id` (uuid, primary key)
      - `pin` (text, unique) - 8-digit PIN for the complainant to check status
      - `hechos` (text) - description of the facts
      - `seccion_lugar` (text) - section and place where it happened
      - `vinculacion` (text) - relationship of the complainant with the company
      - `personas_involucradas` (text) - people involved
      - `momento` (text) - when it happened
      - `documentos_info` (text) - additional documents or information
      - `estado` (text) - status of the complaint (pendiente, en_revision, resuelta)
      - `respuesta` (text) - response from the company
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `denuncias` table
    - No public SELECT policy (complaints are only accessible via edge function with PIN)
    - INSERT allowed for anonymous users (anyone can submit a complaint)
    - Admin (authenticated) can read and update all complaints
*/

CREATE TABLE IF NOT EXISTS denuncias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin text UNIQUE NOT NULL,
  hechos text NOT NULL,
  seccion_lugar text NOT NULL DEFAULT '',
  vinculacion text NOT NULL DEFAULT '',
  personas_involucradas text NOT NULL DEFAULT '',
  momento text NOT NULL DEFAULT '',
  documentos_info text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT 'pendiente',
  respuesta text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a complaint"
  ON denuncias
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all complaints"
  ON denuncias
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update complaints"
  ON denuncias
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
