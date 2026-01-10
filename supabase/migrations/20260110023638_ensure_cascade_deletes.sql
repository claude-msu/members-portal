-- Migration to ensure all CASCADE DELETE constraints are properly set
-- This ensures when a user is deleted from auth.users, all related data is cleaned up

-- Verify and update profiles cascade (should already exist)
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Verify and update user_roles cascade (should already exist)
ALTER TABLE user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey,
  ADD CONSTRAINT user_roles_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Verify and update class_enrollments cascade (should already exist)
ALTER TABLE class_enrollments
  DROP CONSTRAINT IF EXISTS class_enrollments_user_id_fkey,
  ADD CONSTRAINT class_enrollments_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Verify and update project_members cascade (should already exist)
ALTER TABLE project_members
  DROP CONSTRAINT IF EXISTS project_members_user_id_fkey,
  ADD CONSTRAINT project_members_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Verify and update applications cascade (should already exist)
ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS applications_user_id_fkey,
  ADD CONSTRAINT applications_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Verify and update event_attendance cascade (should already exist)
ALTER TABLE event_attendance
  DROP CONSTRAINT IF EXISTS event_attendance_user_id_fkey,
  ADD CONSTRAINT event_attendance_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Verify and update event_checkins cascade
-- event_checkins references profiles, which will cascade from auth.users deletion
ALTER TABLE event_checkins
  DROP CONSTRAINT IF EXISTS event_checkins_user_id_fkey,
  ADD CONSTRAINT event_checkins_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- Comment explaining the cascade chain
COMMENT ON TABLE profiles IS 'Cascades from auth.users deletion';
COMMENT ON TABLE user_roles IS 'Cascades from auth.users deletion';
COMMENT ON TABLE class_enrollments IS 'Cascades from auth.users deletion';
COMMENT ON TABLE project_members IS 'Cascades from auth.users deletion';
COMMENT ON TABLE applications IS 'Cascades from auth.users deletion';
COMMENT ON TABLE event_attendance IS 'Cascades from auth.users deletion';
COMMENT ON TABLE event_checkins IS 'Cascades from profiles deletion (which cascades from auth.users)';