/*
  # Drop news table

  1. Changes
    - Remove the news table from the database
    - All RLS policies associated with the news table will be automatically dropped
*/

DROP TABLE IF EXISTS news;
