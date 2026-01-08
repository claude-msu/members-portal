-- Drop existing policies on applications bucket
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND policyname LIKE '%application%'
    )
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Public read access for applications bucket
CREATE POLICY "Public Access to Applications"
ON storage.objects FOR SELECT
USING (bucket_id = 'applications');

-- Allow authenticated users to upload to applications bucket
CREATE POLICY "Authenticated users can upload applications"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'applications');

-- Allow authenticated users to update files in applications bucket
CREATE POLICY "Authenticated users can update applications"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'applications');

-- Allow authenticated users to delete files in applications bucket
CREATE POLICY "Authenticated users can delete applications"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'applications');