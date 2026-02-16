-- Minimal storage - just the project number
ALTER TABLE projects
  DROP COLUMN IF EXISTS repository_name,
  ADD COLUMN IF NOT EXISTS github_project_id INTEGER;