-- Allow users to view all project members
CREATE POLICY "Project members are viewable by everyone"
  ON project_members FOR SELECT
  USING (true);

-- Allow users to join projects
CREATE POLICY "Users can join projects"
  ON project_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to leave projects they're in
CREATE POLICY "Users can leave projects"
  ON project_members FOR DELETE
  USING (auth.uid() = user_id);