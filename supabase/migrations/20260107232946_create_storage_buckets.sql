-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Create applications bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('applications', 'applications', false)
ON CONFLICT (id) DO NOTHING;

-- Create profiles bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES FOR APPLICATIONS BUCKET
-- ============================================================================

-- Users can upload their own application files
CREATE POLICY "Users can upload their own application files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'applications' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own application files
CREATE POLICY "Users can view their own application files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'applications' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Board/E-board can view all application files
CREATE POLICY "Board can view all application files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'applications' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('board', 'e-board')
  )
);

-- Users can delete their own application files
CREATE POLICY "Users can delete their own application files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'applications' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- STORAGE POLICIES FOR PROFILES BUCKET
-- ============================================================================

-- Anyone can view profile files (public bucket)
CREATE POLICY "Anyone can view profile files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- Users can upload their own profile files
CREATE POLICY "Users can upload their own profile files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own profile files
CREATE POLICY "Users can update their own profile files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own profile files
CREATE POLICY "Users can delete their own profile files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);