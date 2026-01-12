-- Debug migration to check QR code status and ensure they're accessible
-- This migration helps verify that QR codes exist and are properly formatted

-- First, let's check what QR codes exist
DO $$
DECLARE
    qr_record RECORD;
    qr_count INTEGER;
BEGIN
    -- Count total QR codes
    SELECT COUNT(*) INTO qr_count FROM event_qr_codes;
    RAISE NOTICE 'Total QR codes in database: %', qr_count;

    -- Show details of existing QR codes (without sensitive tokens)
    FOR qr_record IN SELECT id, event_id, points, qr_code_url, created_at FROM event_qr_codes LIMIT 10
    LOOP
        RAISE NOTICE 'QR Code ID: %, Event ID: %, Points: %, URL exists: %, Created: %',
            qr_record.id, qr_record.event_id, qr_record.points,
            (qr_record.qr_code_url IS NOT NULL), qr_record.created_at;
    END LOOP;

    -- Check if there are any QR codes without URLs
    SELECT COUNT(*) INTO qr_count FROM event_qr_codes WHERE qr_code_url IS NULL;
    IF qr_count > 0 THEN
        RAISE NOTICE 'WARNING: % QR codes found without URLs!', qr_count;
    END IF;
END $$;

-- Ensure the function permissions are correct
GRANT EXECUTE ON FUNCTION checkin_user_for_event(TEXT) TO authenticated;

-- Test the function with a known token (if any exist)
DO $$
DECLARE
    test_token TEXT;
    test_result JSONB;
BEGIN
    -- Get one token for testing
    SELECT token INTO test_token FROM event_qr_codes LIMIT 1;

    IF test_token IS NOT NULL THEN
        RAISE NOTICE 'Testing with token: %', substring(test_token, 1, 8) || '...';

        -- Note: We can't actually call the function here because it requires auth context
        -- But we can verify the token exists
        RAISE NOTICE 'Token exists and should be usable for check-in';
    ELSE
        RAISE NOTICE 'No QR codes found in database';
    END IF;
END $$;