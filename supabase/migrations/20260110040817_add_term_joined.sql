-- Migration: Add term_joined to profiles with auto-calculation

-- Add term_joined column to profiles table
ALTER TABLE profiles
ADD COLUMN term_joined UUID REFERENCES semesters(id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_term_joined ON profiles(term_joined);

-- Function to auto-calculate term_joined based on created_at
-- Matches if created_at is between (start_date - 1 month) and end_date
CREATE OR REPLACE FUNCTION set_term_joined()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  matching_semester_id UUID;
BEGIN
  -- Find semester where profile creation date falls between:
  -- (start_date - 1 month) and end_date
  -- This allows members to join up to 1 month before classes start
  SELECT id INTO matching_semester_id
  FROM semesters
  WHERE NEW.created_at::date >= (start_date - INTERVAL '1 month')::date
    AND NEW.created_at::date <= end_date::date
  LIMIT 1;

  -- Set term_joined to the matching semester (or NULL if no match)
  NEW.term_joined := matching_semester_id;

  RETURN NEW;
END;
$$;

-- Create trigger to auto-set term_joined on profile creation
DROP TRIGGER IF EXISTS trigger_set_term_joined ON profiles;
CREATE TRIGGER trigger_set_term_joined
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_term_joined();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION set_term_joined() TO authenticated, anon;

-- Backfill existing profiles (optional - updates existing profiles with their term_joined)
UPDATE profiles p
SET term_joined = (
  SELECT s.id
  FROM semesters s
  WHERE p.created_at::date >= (s.start_date - INTERVAL '1 month')::date
    AND p.created_at::date <= s.end_date::date
  LIMIT 1
)
WHERE term_joined IS NULL;

COMMENT ON COLUMN profiles.term_joined IS
  'The semester when the user joined the club. Auto-calculated based on created_at timestamp. Matches if created_at is between (semester.start_date - 1 month) and semester.end_date, allowing members to join up to 1 month before classes start.';

COMMENT ON FUNCTION set_term_joined() IS
  'Automatically sets term_joined based on which semester the profile was created in. Includes a 1-month buffer before semester start_date to allow early signups.';