-- Update the checkin_user_for_event function to handle RSVP requirements

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
  v_event events%ROWTYPE;
  v_has_rsvped BOOLEAN;
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

  -- Get event details
  SELECT * INTO v_event FROM events WHERE id = v_qr_code.event_id;

  -- Check if user has RSVPed
  SELECT EXISTS(
    SELECT 1 FROM event_attendance
    WHERE event_id = v_qr_code.event_id AND user_id = v_user_id
    AND rsvped_at IS NOT NULL
  ) INTO v_has_rsvped;

  -- If event requires RSVP and user hasn't RSVPed, log violation and deny checkin
  IF v_event.rsvp_required AND NOT v_has_rsvped THEN
    -- Log the violation for admin review using PostgreSQL logging
    RAISE LOG 'RSVP VIOLATION: User % attempted to check in to RSVP-required event "%" without RSVP (token: %)',
      v_user_id, v_event.name, p_token;

    RETURN jsonb_build_object(
      'success', false,
      'message', 'You must RSVP to this event before checking in. This violation has been logged.'
    );
  END IF;

  -- Check if already checked in
  SELECT EXISTS(
    SELECT 1 FROM event_attendance
    WHERE event_id = v_qr_code.event_id AND user_id = v_user_id
    AND attended_at IS NOT NULL
  ) INTO v_already_checked_in;

  IF v_already_checked_in THEN
    RETURN jsonb_build_object('success', false, 'message', 'Already checked in to this event');
  END IF;

  -- Insert or update attendance record
  INSERT INTO event_attendance (event_id, user_id, rsvped_at, attended_at)
  VALUES (
    v_qr_code.event_id,
    v_user_id,
    CASE WHEN v_has_rsvped THEN (SELECT rsvped_at FROM event_attendance
                                  WHERE event_id = v_qr_code.event_id AND user_id = v_user_id)
         ELSE NOW() END,  -- For non-RSVP events, set rsvped_at to checkin time
    NOW()
  )
  ON CONFLICT (event_id, user_id)
  DO UPDATE SET
    attended_at = NOW();

  -- Award points to user
  UPDATE profiles
  SET points = points + v_qr_code.points
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Successfully checked in!',
    'event_name', v_event.name,
    'points_awarded', v_qr_code.points
  );
END;
$$;


-- Grant execute permission
GRANT EXECUTE ON FUNCTION checkin_user_for_event(TEXT) TO authenticated;