-- Drop old function
DROP FUNCTION IF EXISTS delete_own_account();
DROP FUNCTION IF EXISTS delete_profile(UUID);
-- Also drop the user deletion functions, grants, and comments defined in 20260110030518_rpc_user_deletion.sql

DROP FUNCTION IF EXISTS delete_user_by_id(UUID);
REVOKE EXECUTE ON FUNCTION delete_user_by_id(UUID) FROM authenticated;
-- Remove comments if your migration tool doesn't remove them automatically.


-- First, update foreign key constraints to reference profiles instead of auth.users
-- This allows cascading from profiles → other tables

-- Applications
ALTER TABLE IF EXISTS applications
  DROP CONSTRAINT IF EXISTS applications_user_id_fkey,
  ADD CONSTRAINT applications_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- Class enrollments
ALTER TABLE IF EXISTS class_enrollments
  DROP CONSTRAINT IF EXISTS class_enrollments_user_id_fkey,
  ADD CONSTRAINT class_enrollments_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- Project members
ALTER TABLE IF EXISTS project_members
  DROP CONSTRAINT IF EXISTS project_members_user_id_fkey,
  ADD CONSTRAINT project_members_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- Event attendance
ALTER TABLE IF EXISTS event_attendance
  DROP CONSTRAINT IF EXISTS event_attendance_user_id_fkey,
  ADD CONSTRAINT event_attendance_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- Function to delete a user account with S3 cleanup
CREATE OR REPLACE FUNCTION delete_profile(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  board_role_exists BOOLEAN;
  user_avatar_url TEXT;
  user_resume_url TEXT;
  avatar_path TEXT;
  resume_path TEXT;
BEGIN
  -- Get current user's UUID
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;

  -- Check if current user is allowed (self or board+)
  IF current_user_id = target_user_id THEN
    -- Self can always delete
    NULL;
  ELSE
    -- Check if current user has board role
    SELECT EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = current_user_id AND ur.role IN ('board', 'e-board')
    )
    INTO board_role_exists;

    IF NOT board_role_exists THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Insufficient permissions'
      );
    END IF;
  END IF;

  -- Get profile_picture_url and resume_url from profile
  SELECT profile_picture_url, resume_url
  INTO user_avatar_url, user_resume_url
  FROM profiles
  WHERE id = target_user_id;

  -- Delete avatar from storage if exists
  IF user_avatar_url IS NOT NULL AND user_avatar_url != '' THEN
    BEGIN
      -- Extract path from URL (format: .../storage/v1/object/public/avatars/path)
      avatar_path := regexp_replace(user_avatar_url, '^.*/avatars/', '');

      IF avatar_path IS NOT NULL AND avatar_path != '' THEN
        DELETE FROM storage.objects
        WHERE bucket_id = 'avatars' AND name = avatar_path;
        RAISE NOTICE 'Deleted avatar: %', avatar_path;
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Failed to delete avatar for user %: %', target_user_id, SQLERRM;
    END;
  END IF;

  -- Delete resume from storage if exists
  IF user_resume_url IS NOT NULL AND user_resume_url != '' THEN
    BEGIN
      -- Extract path from URL (format: .../storage/v1/object/public/resumes/path)
      resume_path := regexp_replace(user_resume_url, '^.*/resumes/', '');

      IF resume_path IS NOT NULL AND resume_path != '' THEN
        DELETE FROM storage.objects
        WHERE bucket_id = 'resumes' AND name = resume_path;
        RAISE NOTICE 'Deleted resume: %', resume_path;
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Failed to delete resume for user %: %', target_user_id, SQLERRM;
    END;
  END IF;

  -- Delete from auth.users (cascades to profiles, which then cascades to all related tables)
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Account and all related data deleted successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

GRANT EXECUTE ON FUNCTION delete_profile(UUID) TO authenticated;

COMMENT ON FUNCTION delete_profile(UUID) IS
  'Deletes a user account, S3 files (avatar/resume), and all related data via cascades. Callable by the user themself or board+ roles.';