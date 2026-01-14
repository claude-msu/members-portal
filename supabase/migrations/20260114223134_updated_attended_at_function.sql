-- Update the checkin_user_for_event function to set attended_at timestamp

CREATE OR REPLACE FUNCTION checkin_user_for_event(
  p_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_qr_code event_qr_codes%ROWTYPE;
  v_user_id UUID;
  v_points INTEGER;
  v_event_name TEXT;
  v_already_checked_in BOOLEAN;
BEGIN
  -- Get user ID
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authenticated');
  END IF;

  -- Get QR code details
  SELECT * INTO v_qr_code
  FROM event_qr_codes
  WHERE token = p_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid or expired QR code');
  END IF;

  -- Check if already checked in
  SELECT EXISTS(
    SELECT 1 FROM event_attendance
    WHERE event_id = v_qr_code.event_id
      AND user_id = v_user_id
      AND attended_at IS NOT NULL
  ) INTO v_already_checked_in;

  IF v_already_checked_in THEN
    RETURN jsonb_build_object('success', false, 'message', 'Already checked in to this event');
  END IF;

  -- Get event name
  SELECT name INTO v_event_name FROM events WHERE id = v_qr_code.event_id;

  -- Insert check-in record with attended_at timestamp
  INSERT INTO event_attendance (event_id, user_id, attended_at)
  VALUES (v_qr_code.event_id, v_user_id, NOW());

  -- Award points to user
  UPDATE profiles
  SET points = points + v_qr_code.points
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Successfully checked in!',
    'event_name', v_event_name
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION checkin_user_for_event(TEXT) TO authenticated;