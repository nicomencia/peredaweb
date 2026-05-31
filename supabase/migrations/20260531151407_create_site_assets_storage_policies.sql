/*
  # Create storage policies for site-assets bucket

  1. Security
    - Public read access for site-assets bucket (images displayed on public pages)
    - Authenticated users can upload/update/delete files in site-assets bucket
*/

CREATE POLICY "Public read access for site-assets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can upload site-assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can update site-assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets')
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can delete site-assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');
