-- Drop the old trigger-based system
DROP TRIGGER IF EXISTS trigger_delete_event_related_data ON events;
DROP FUNCTION IF EXISTS delete_event_related_data();

-- Function to delete an event with QR code cleanup
CREATE OR REPLACE FUNCTION delete_event(target_event_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  board_role_exists BOOLEAN;
  qr_code_record RECORD;
  qr_code_path TEXT;
BEGIN
  -- Get current user's UUID
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  END IF;

  -- Check if current user has board+ role
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = current_user_id AND ur.role IN ('board', 'e-board')
  )
  INTO board_role_exists;

  IF NOT board_role_exists THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient permissions'
    );
  END IF;

  -- Delete QR code images from storage before deleting event
  FOR qr_code_record IN
    SELECT qr_code_url
    FROM event_qr_codes
    WHERE event_id = target_event_id AND qr_code_url IS NOT NULL
  LOOP
    BEGIN
      -- Extract path from URL (format: .../storage/v1/object/public/events/qr-codes/filename.png)
      qr_code_path := substring(qr_code_record.qr_code_url from 'qr-codes/[^?]+');

      IF qr_code_path IS NOT NULL AND qr_code_path != '' THEN
        DELETE FROM storage.objects
        WHERE bucket_id = 'events' AND name = qr_code_path;
        RAISE NOTICE 'Deleted QR code: %', qr_code_path;
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Failed to delete QR code for event %: %', target_event_id, SQLERRM;
    END;
  END LOOP;

  -- Delete the event (CASCADE will handle event_qr_codes and event_attendance)
  DELETE FROM events WHERE id = target_event_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Event and all related data deleted successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

GRANT EXECUTE ON FUNCTION delete_event(UUID) TO authenticated;

COMMENT ON FUNCTION delete_event(UUID) IS
  'Deletes an event, QR code images, and all related data (event_qr_codes, event_attendance) via cascades. Only callable by board+ roles.';