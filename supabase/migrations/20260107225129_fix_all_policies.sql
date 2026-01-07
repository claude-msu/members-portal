-- ============================================================================
-- DROP ALL EXISTING POLICIES
-- ============================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on all tables
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
            r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

CREATE POLICY "profiles_select_authenticated"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================================
-- USER ROLES POLICIES
-- ============================================================================

CREATE POLICY "user_roles_select_authenticated"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "user_roles_insert_own"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_roles_update_own"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- CLASSES POLICIES
-- ============================================================================

CREATE POLICY "classes_select_all"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "classes_insert_authenticated"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "classes_update_creator"
  ON classes FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "classes_delete_creator"
  ON classes FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ============================================================================
-- CLASS ENROLLMENTS POLICIES
-- ============================================================================

CREATE POLICY "class_enrollments_select_all"
  ON class_enrollments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "class_enrollments_insert_own"
  ON class_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "class_enrollments_delete_own"
  ON class_enrollments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================

CREATE POLICY "projects_select_all"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "projects_insert_authenticated"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "projects_update_creator"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "projects_delete_creator"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ============================================================================
-- PROJECT MEMBERS POLICIES
-- ============================================================================

CREATE POLICY "project_members_select_all"
  ON project_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "project_members_insert_own"
  ON project_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_members_delete_own"
  ON project_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- EVENTS POLICIES
-- ============================================================================

CREATE POLICY "events_select_by_role"
  ON events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = ANY(allowed_roles)
    )
  );

CREATE POLICY "events_insert_authenticated"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "events_update_creator"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "events_delete_creator"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ============================================================================
-- EVENT ATTENDANCE POLICIES
-- ============================================================================

CREATE POLICY "event_attendance_select_own"
  ON event_attendance FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "event_attendance_insert_own"
  ON event_attendance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "event_attendance_update_own"
  ON event_attendance FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "event_attendance_delete_own"
  ON event_attendance FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- APPLICATIONS POLICIES
-- ============================================================================

CREATE POLICY "applications_select_own"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "applications_insert_own"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "applications_update_own"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "applications_delete_own"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);