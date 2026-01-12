-- ============================================================================
-- ENSURE PROSPECTS CAN UPLOAD RESUMES AND TRANSCRIPTS
-- This migration explicitly confirms and enforces that all authenticated users,
-- including prospects, can upload resumes and transcripts for applications
-- ============================================================================

-- ============================================================================
-- PART 1: APPLICATIONS TABLE RLS POLICIES
-- ============================================================================

-- Ensure users (including prospects) can create applications with resumes/transcripts
-- This policy should already exist, but we'll recreate it to be explicit
DROP POLICY IF EXISTS "Users can create applications" ON applications;
CREATE POLICY "Users can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure users (including prospects) can view their own applications
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- PART 2: APPLICATIONS STORAGE BUCKET POLICIES
-- ============================================================================

-- Drop existing application file policies to recreate them explicitly
DROP POLICY IF EXISTS "Users can upload own application files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own application files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own application files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own application files" ON storage.objects;

-- Policy 1: ANY authenticated user (including prospects) can upload their own application files
-- Files are stored as: {userName}_{userId}/resume.pdf or {userName}_{userId}/transcript.pdf
-- The folder name format is: {userName}_{userId}, so we check if it ends with the user ID
CREATE POLICY "Users can upload own application files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'applications' AND
  (
    -- Match if folder name is exactly the user ID (for backwards compatibility)
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Match if folder name ends with _{userId} (format: {userName}_{userId})
    -- Use regex to check if the folder name ends with an underscore followed by the user ID
    (storage.foldername(name))[1] ~ ('_' || auth.uid()::text || '$')
  )
);

-- Policy 2: ANY authenticated user (including prospects) can view their own application files
CREATE POLICY "Users can view own application files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'applications' AND
  (
    -- Match if folder name is exactly the user ID (for backwards compatibility)
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Match if folder name ends with _{userId} (format: {userName}_{userId})
    (storage.foldername(name))[1] ~ ('_' || auth.uid()::text || '$')
  )
);

-- Policy 3: ANY authenticated user (including prospects) can update their own application files
CREATE POLICY "Users can update own application files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'applications' AND
  (
    -- Match if folder name is exactly the user ID (for backwards compatibility)
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Match if folder name ends with _{userId} (format: {userName}_{userId})
    (storage.foldername(name))[1] ~ ('_' || auth.uid()::text || '$')
  )
);

-- Policy 4: ANY authenticated user (including prospects) can delete their own application files
CREATE POLICY "Users can delete own application files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'applications' AND
  (
    -- Match if folder name is exactly the user ID (for backwards compatibility)
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Match if folder name ends with _{userId} (format: {userName}_{userId})
    (storage.foldername(name))[1] ~ ('_' || auth.uid()::text || '$')
  )
);

-- Keep existing board policies for viewing all application files
-- (These should already exist, but we won't drop them)

-- ============================================================================
-- PART 3: PROFILES STORAGE BUCKET POLICIES (for profile resumes)
-- ============================================================================

-- Ensure ANY authenticated user (including prospects) can upload resumes to their profile
-- The existing policies should already allow this, but we'll verify they're correct

-- Note: The profiles bucket resume policies are already set up correctly in
-- migration 20260108010524_fix_profiles_bucket_policies.sql
-- They use "TO authenticated" which includes prospects

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- ✅ Prospects can create applications (applications table INSERT policy)
-- ✅ Prospects can upload resumes for applications (applications bucket INSERT policy)
-- ✅ Prospects can upload transcripts for applications (applications bucket INSERT policy)
-- ✅ Prospects can upload resumes to their profile (profiles bucket INSERT policy)
-- ✅ Prospects can view/update/delete their own uploaded files
-- ✅ Board/E-board can still view all application files for review
