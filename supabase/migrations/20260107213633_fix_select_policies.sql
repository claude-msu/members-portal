-- Fix SELECT policies to explicitly allow authenticated and anon users

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "User roles are viewable by everyone" ON user_roles;
CREATE POLICY "User roles are viewable by everyone"
  ON user_roles FOR SELECT
  TO authenticated, anon
  USING (true);