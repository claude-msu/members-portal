-- Function to delete file from storage bucket
CREATE OR REPLACE FUNCTION delete_storage_object(
  bucket_name text,
  file_path text
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = bucket_name
    AND name = file_path;
END;
$$;

-- Function to delete application files from storage when application is deleted
CREATE OR REPLACE FUNCTION delete_application_files()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete resume file if it exists
  IF OLD.resume_url IS NOT NULL THEN
    PERFORM delete_storage_object('applications', OLD.resume_url);
  END IF;

  -- Delete transcript file if it exists
  IF OLD.transcript_url IS NOT NULL THEN
    PERFORM delete_storage_object('applications', OLD.transcript_url);
  END IF;

  RETURN OLD;
END;
$$;

-- Create trigger that fires BEFORE DELETE on applications table
DROP TRIGGER IF EXISTS trigger_delete_application_files ON applications;
CREATE TRIGGER trigger_delete_application_files
  BEFORE DELETE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION delete_application_files();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION delete_storage_object(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_application_files() TO authenticated;