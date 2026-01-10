
-- Drop trigger, function, policy, and grant related to old profile deletion mechanism
DROP TRIGGER IF EXISTS trigger_delete_auth_user ON profiles;
DROP FUNCTION IF EXISTS delete_auth_user_on_profile_deletion;
DROP POLICY IF EXISTS "e_board_can_delete_profiles" ON profiles;


-- Function to delete a user (kick or ban)
-- This function uses SECURITY DEFINER to access auth.users
CREATE OR REPLACE FUNCTION delete_user_by_id(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  calling_user_role app_role;
BEGIN
  -- Check if the calling user is e-board
  SELECT role INTO calling_user_role
  FROM user_roles
  WHERE user_id = auth.uid();

  IF calling_user_role != 'e-board' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Only e-board members can delete users'
    );
  END IF;

  -- Prevent self-deletion
  IF target_user_id = auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot delete your own account'
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
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User deleted successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION delete_user_by_id(UUID) TO authenticated;

COMMENT ON FUNCTION delete_user_by_id(UUID) IS
  'Allows e-board to delete users. Deletes from auth.users which cascades to all related tables.';