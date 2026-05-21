/*
  # Add specs column to ambientes table

  1. Modified Tables
    - `ambientes`
      - `specs` (jsonb) - Structured product specifications displayed alongside the cover image.
        Expected format: array of objects with `category` (string) and `items` (array of strings).
        Example: [{"category": "REVESTIMIENTO", "items": ["Porcelanico Rue de Paris 37x75 cm"]}]

  2. Important Notes
    - Uses JSONB for flexible, queryable specification data
    - Defaults to empty array so existing ambientes are unaffected
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ambientes' AND column_name = 'specs'
  ) THEN
    ALTER TABLE ambientes ADD COLUMN specs jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;
