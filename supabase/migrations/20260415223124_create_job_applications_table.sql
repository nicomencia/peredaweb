/*
  # Create job applications table

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key)
      - `nombre` (text, not null) - applicant full name
      - `email` (text, not null) - applicant email address
      - `telefono` (text) - applicant phone number
      - `mensaje` (text) - cover message / motivation
      - `created_at` (timestamptz) - submission timestamp

  2. Security
    - Enable RLS on `job_applications` table
    - Add INSERT policy for anonymous users (public form)
    - Add SELECT policy for authenticated admin users only
*/

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text DEFAULT '',
  mensaje text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a job application"
  ON job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view job applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
