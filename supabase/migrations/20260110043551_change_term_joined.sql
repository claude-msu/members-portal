-- Migration: Change term_joined from UUID to TEXT (semester code)
-- Run this AFTER the initial add_term_joined.sql migration

-- Drop the trigger first
DROP TRIGGER IF EXISTS trigger_set_term_joined ON profiles;

-- Drop the function
DROP FUNCTION IF EXISTS set_term_joined();

-- Drop the index
DROP INDEX IF EXISTS idx_profiles_term_joined;

-- Drop the column (this removes the FK constraint automatically)
ALTER TABLE profiles
DROP COLUMN IF EXISTS term_joined;

-- Re-add column as TEXT
ALTER TABLE profiles
ADD COLUMN term_joined TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_term_joined ON profiles(term_joined);

-- Function to auto-calculate term_joined based on created_at
-- Now sets the semester CODE instead of ID
CREATE OR REPLACE FUNCTION set_term_joined()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  matching_semester_code TEXT;
BEGIN
  -- Find semester where profile creation date falls between:
  -- (start_date - 1 month) and end_date
  -- Get the CODE instead of ID
  SELECT code INTO matching_semester_code
  FROM semesters
  WHERE NEW.created_at::date >= (start_date - INTERVAL '1 month')::date
    AND NEW.created_at::date <= end_date::date
  LIMIT 1;

  -- Set term_joined to the matching semester code (or NULL if no match)
  NEW.term_joined := matching_semester_code;

  RETURN NEW;
END;
$$;

-- Create trigger to auto-set term_joined on profile creation
CREATE TRIGGER trigger_set_term_joined
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_term_joined();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION set_term_joined() TO authenticated, anon;

-- Backfill existing profiles with semester codes
UPDATE profiles p
SET term_joined = (
  SELECT s.code
  FROM semesters s
  WHERE p.created_at::date >= (s.start_date - INTERVAL '1 month')::date
    AND p.created_at::date <= s.end_date::date
  LIMIT 1
)
WHERE term_joined IS NULL;

COMMENT ON COLUMN profiles.term_joined IS
  'The semester code when the user joined the club (e.g., "W26", "F25"). Auto-calculated based on created_at timestamp. Matches if created_at is between (semester.start_date - 1 month) and semester.end_date, allowing members to join up to 1 month before classes start.';

COMMENT ON FUNCTION set_term_joined() IS
  'Automatically sets term_joined to the semester code based on which semester the profile was created in. Includes a 1-month buffer before semester start_date to allow early signups.';