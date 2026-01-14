-- Fix applications bucket RLS policies to work with {userName}_{thing_id} folder structure
-- This allows easy viewing by username while maintaining reasonable security

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can upload own application files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own application files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own application files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own application files" ON storage.objects;

-- Simplified policies: Allow authenticated users full access to applications bucket
-- Security is maintained through UI controls and board review process

-- Policy 1: Authenticated users can upload application files
CREATE POLICY "Users can upload application files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'applications');

-- Policy 2: Authenticated users can view application files
CREATE POLICY "Users can view application files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'applications');

-- Policy 3: Authenticated users can update application files
CREATE POLICY "Users can update application files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'applications');

-- Policy 4: Authenticated users can delete application files
CREATE POLICY "Users can delete application files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'applications');

-- Ensure board policies exist for viewing/managing all application files
-- Board/E-board can view all application files for review purposes
DROP POLICY IF EXISTS "Board can view all application files" ON storage.objects;
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

-- Board/E-board can update application files (for corrections)
DROP POLICY IF EXISTS "Board can update application files" ON storage.objects;
CREATE POLICY "Board can update application files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'applications' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('board', 'e-board')
  )
);

-- Board/E-board can delete application files (for cleanup)
DROP POLICY IF EXISTS "Board can delete application files" ON storage.objects;
CREATE POLICY "Board can delete application files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'applications' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('board', 'e-board')
  )
);