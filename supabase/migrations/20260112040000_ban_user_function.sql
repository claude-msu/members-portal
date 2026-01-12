-- Function to ban a user using Supabase auth admin API
-- This function uses SECURITY DEFINER to access auth.admin functions
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

  -- Ban the user using auth.admin.update_user_by_id
  -- Using a very long duration (100 years) for permanent ban
  PERFORM auth.admin.update_user_by_id(target_user_id, '{"ban_duration": "876600h"}');

  -- Delete the user's profile and related data (but keep auth user record for ban enforcement)
  DELETE FROM profiles WHERE id = target_user_id;

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
  'Allows e-board to ban users using auth.admin.update_user_by_id. Deletes profile data but keeps auth user banned.';