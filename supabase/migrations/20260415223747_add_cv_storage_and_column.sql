/*
  # Add CV upload support for job applications

  1. Storage
    - Create `cvs` storage bucket for PDF uploads (if not exists)
    - Add upload policy for anonymous users
    - Add view policy for authenticated users

  2. Modified Tables
    - `job_applications`
      - Add `cv_url` (text) - URL to the uploaded CV file in storage
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can upload a CV' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Anyone can upload a CV"
      ON storage.objects
      FOR INSERT
      TO anon
      WITH CHECK (bucket_id = 'cvs');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view CVs' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Authenticated users can view CVs"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (bucket_id = 'cvs');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_applications' AND column_name = 'cv_url'
  ) THEN
    ALTER TABLE job_applications ADD COLUMN cv_url text DEFAULT '';
  END IF;
END $$;
