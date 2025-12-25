-- Add music category enum type
CREATE TYPE music_category AS ENUM (
  'phonk',
  'bollywood',
  'hollywood',
  'romantic',
  'gym',
  'casual',
  'funny',
  'pop',
  'rock',
  'hip-hop',
  'electronic',
  'jazz',
  'classical',
  'country',
  'r&b',
  'indie',
  'folk',
  'metal',
  'blues',
  'reggae',
  'latin',
  'k-pop',
  'anime',
  'lo-fi',
  'chill',
  'party',
  'workout',
  'study',
  'sleep',
  'meditation',
  'other'
);

-- Update tracks table to use the enum for music categories
-- First, we'll keep the existing category column as text for podcasts
-- and add a new column for music categories
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS music_category music_category;

-- Add a comment to clarify usage
COMMENT ON COLUMN tracks.category IS 'Used for podcast categories (text)';
COMMENT ON COLUMN tracks.music_category IS 'Used for music categories (enum)';