-- Fix storage policies - comprehensive cleanup and recreation

-- Drop ALL existing storage policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- Profiles bucket policies (avatars folder - public)
CREATE POLICY "Users can upload to avatars folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can update their avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'avatars'
);

CREATE POLICY "Users can delete their avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Resume policies (resumes folder - private, board can access)
CREATE POLICY "Users can upload to resumes folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can update their resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Board can view all resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'resumes'
  AND (has_role(auth.uid(), 'board') OR has_role(auth.uid(), 'e-board'))
);

CREATE POLICY "Users can delete their resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Application files policies
CREATE POLICY "Users can upload application files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'applications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update application files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'applications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their application files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'applications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Board can view all application files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'applications'
  AND (has_role(auth.uid(), 'board') OR has_role(auth.uid(), 'e-board'))
);

CREATE POLICY "Users can delete application files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'applications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);