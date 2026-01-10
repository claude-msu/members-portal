-- Migration: Simple trigger-based user deletion
-- E-board can delete profiles directly, which cascades to all related data
-- Auth user cleanup happens via trigger

-- Create banned_users table to track banned members
CREATE TABLE IF NOT EXISTS banned_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  banned_by UUID REFERENCES auth.users(id),
  reason TEXT,
  banned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on banned_users
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;

-- E-board can view and manage banned users
CREATE POLICY "e_board_can_view_banned_users"
  ON banned_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'e-board'
    )
  );

CREATE POLICY "e_board_can_insert_banned_users"
  ON banned_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'e-board'
    )
  );

-- Add index on email for ban checking
CREATE INDEX IF NOT EXISTS idx_banned_users_email ON banned_users(email);

-- Add RLS policy to allow e-board to delete profiles
CREATE POLICY "e_board_can_delete_profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'e-board'
    )
    AND id != auth.uid() -- Can't delete own profile
  );

-- Function to delete auth user when profile is deleted
CREATE OR REPLACE FUNCTION delete_auth_user_on_profile_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the user from auth.users
  -- This requires the function to have SECURITY DEFINER
  DELETE FROM auth.users WHERE id = OLD.id;

  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the profile deletion
    RAISE WARNING 'Failed to delete auth user %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$$;

-- Create trigger on profiles deletion
DROP TRIGGER IF EXISTS trigger_delete_auth_user ON profiles;
CREATE TRIGGER trigger_delete_auth_user
  BEFORE DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION delete_auth_user_on_profile_deletion();

-- Grant permissions
GRANT EXECUTE ON FUNCTION delete_auth_user_on_profile_deletion() TO authenticated;

COMMENT ON FUNCTION delete_auth_user_on_profile_deletion() IS
  'Automatically deletes auth.users record when a profile is deleted. Requires SECURITY DEFINER to access auth schema.';

COMMENT ON TABLE banned_users IS
  'Tracks permanently banned users to prevent re-registration with the same email';