-- Function to allow users to delete their own account
-- This function uses SECURITY DEFINER to access auth.users
CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the authenticated user's ID
  current_user_id := auth.uid();

  -- Ensure user is authenticated
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;

  -- Delete from auth.users
  -- This will CASCADE to:
  -- - profiles (which cascades to event_checkins)
  -- - user_roles
  -- - class_enrollments
  -- - project_members
  -- - applications
  -- - event_attendance
  DELETE FROM auth.users WHERE id = current_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Account deleted successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;

COMMENT ON FUNCTION delete_own_account() IS
  'Allows authenticated users to delete their own account. Deletes from auth.users which cascades to all related tables including profiles, roles, enrollments, etc.';
