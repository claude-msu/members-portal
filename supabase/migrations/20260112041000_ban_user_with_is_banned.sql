-- Function to ban a user by setting is_banned = true on profiles
-- This approach avoids cross-database reference issues with auth.admin functions
CREATE OR REPLACE FUNCTION ban_user_by_id(target_user_id UUID)
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
      'error', 'Only e-board members can ban users'
    );
  END IF;

  -- Prevent self-banning
  IF target_user_id = auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot ban your own account'
    );
  END IF;

  -- Update the profile to mark as banned
  UPDATE profiles
  SET is_banned = true,
      updated_at = now()
  WHERE id = target_user_id;

  -- Check if the update was successful
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User profile not found'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User banned successfully'
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
GRANT EXECUTE ON FUNCTION ban_user_by_id(UUID) TO authenticated;

COMMENT ON FUNCTION ban_user_by_id(UUID) IS
  'Allows e-board to ban users by setting is_banned = true on their profile.';