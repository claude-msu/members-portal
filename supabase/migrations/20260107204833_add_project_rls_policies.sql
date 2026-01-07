-- Allow board/e-board to add project members
CREATE POLICY "Board can manage project members"
  ON project_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('board', 'e-board')
    )
  );