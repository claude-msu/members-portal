-- Drop all existing RLS policies to start fresh
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
    END LOOP;

    -- Drop all policies on user_roles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_roles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_roles';
    END LOOP;

    -- Drop all policies on classes
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'classes') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON classes';
    END LOOP;

    -- Drop all policies on class_enrollments
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'class_enrollments') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON class_enrollments';
    END LOOP;

    -- Drop all policies on projects
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'projects') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON projects';
    END LOOP;

    -- Drop all policies on project_members
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'project_members') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON project_members';
    END LOOP;

    -- Drop all policies on events
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'events') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON events';
    END LOOP;

    -- Drop all policies on event_attendance
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'event_attendance') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON event_attendance';
    END LOOP;

    -- Drop all policies on applications
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'applications') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON applications';
    END LOOP;
END $$;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile during signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- USER ROLES POLICIES
-- ============================================================================

CREATE POLICY "User roles are viewable by everyone"
  ON user_roles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own role during signup"
  ON user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own role"
  ON user_roles FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- CLASSES POLICIES
-- ============================================================================

CREATE POLICY "Classes are viewable by everyone"
  ON classes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create classes"
  ON classes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Class creators can update their classes"
  ON classes FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Class creators can delete their classes"
  ON classes FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- CLASS ENROLLMENTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view class enrollments"
  ON class_enrollments FOR SELECT
  USING (true);

CREATE POLICY "Users can enroll in classes"
  ON class_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unenroll from classes"
  ON class_enrollments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================

CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project creators can update their projects"
  ON projects FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Project creators can delete their projects"
  ON projects FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- PROJECT MEMBERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view project members"
  ON project_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join projects"
  ON project_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave projects"
  ON project_members FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- EVENTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view events for their role"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = ANY(allowed_roles)
    )
  );

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can update their events"
  ON events FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Event creators can delete their events"
  ON events FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================================================
-- EVENT ATTENDANCE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own attendance"
  ON event_attendance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can RSVP to events"
  ON event_attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance"
  ON event_attendance FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own RSVP"
  ON event_attendance FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- APPLICATIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON applications FOR DELETE
  USING (auth.uid() = user_id);