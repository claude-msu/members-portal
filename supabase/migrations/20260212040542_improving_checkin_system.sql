-- Drop old function
DROP FUNCTION IF EXISTS checkin_user_for_event(TEXT);

-- Drop points column from event_qr_codes
ALTER TABLE event_qr_codes DROP COLUMN IF EXISTS points;

-- Create new simplified checkin function
CREATE OR REPLACE FUNCTION checkin_member(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_qr_code event_qr_codes%ROWTYPE;
  v_user_id UUID;
  v_event events%ROWTYPE;
  v_has_rsvped BOOLEAN;
  v_already_checked_in BOOLEAN;
  v_points_delta INTEGER;
BEGIN
  -- Get authenticated user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authenticated');
  END IF;

  -- Get QR code and event details
  SELECT qr.*, e.* INTO v_qr_code, v_event
  FROM event_qr_codes qr
  JOIN events e ON e.id = qr.event_id
  WHERE qr.token = p_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid or expired QR code');
  END IF;

  -- Check existing attendance status
  SELECT
    rsvped_at IS NOT NULL,
    attended_at IS NOT NULL
  INTO v_has_rsvped, v_already_checked_in
  FROM event_attendance
  WHERE event_id = v_event.id AND user_id = v_user_id;

  IF v_already_checked_in THEN
    RETURN jsonb_build_object('success', false, 'message', 'Already checked in');
  END IF;

  -- Calculate points: deduct if RSVP required but didn't RSVP, otherwise award
  v_points_delta := CASE
    WHEN v_event.rsvp_required AND NOT COALESCE(v_has_rsvped, false) THEN -v_event.points
    ELSE v_event.points
  END;

  -- Insert/update attendance record
  INSERT INTO event_attendance (event_id, user_id, rsvped_at, attended_at)
  VALUES (
    v_event.id,
    v_user_id,
    COALESCE(
      (SELECT rsvped_at FROM event_attendance WHERE event_id = v_event.id AND user_id = v_user_id),
      NOW()
    ),
    NOW()
  )
  ON CONFLICT (event_id, user_id)
  DO UPDATE SET attended_at = NOW();

  -- Update member points
  UPDATE profiles
  SET points = GREATEST(0, points + v_points_delta)
  WHERE id = v_user_id;

  -- Return success response
  RETURN jsonb_build_object(
    'success', true,
    'message', CASE
      WHEN v_points_delta < 0 THEN 'Checked in, but points deducted for not RSVPing'
      ELSE 'Successfully checked in!'
    END,
    'event_name', v_event.name,
    'points_awarded', v_points_delta
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION checkin_member(TEXT) TO authenticated;