-- Allow users to insert their own profile during signup
CREATE POLICY "Users can create own profile during signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own role during signup
CREATE POLICY "Users can create own role during signup"
  ON user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);