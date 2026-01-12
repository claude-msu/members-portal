-- Detailed QR code debugging
DO $$
DECLARE
    qr_record RECORD;
BEGIN
    RAISE NOTICE '=== QR CODE DEBUG INFORMATION ===';

    -- Get all QR codes with full details
    FOR qr_record IN SELECT * FROM event_qr_codes ORDER BY created_at DESC
    LOOP
        RAISE NOTICE 'QR Code Details:';
        RAISE NOTICE '  ID: %', qr_record.id;
        RAISE NOTICE '  Event ID: %', qr_record.event_id;
        RAISE NOTICE '  Token: %', qr_record.token;
        RAISE NOTICE '  Points: %', qr_record.points;
        RAISE NOTICE '  QR Code URL: %', qr_record.qr_code_url;
        RAISE NOTICE '  Created: %', qr_record.created_at;
        RAISE NOTICE '---';
    END LOOP;

    -- Check events table to see if events exist
    RAISE NOTICE '=== EVENT INFORMATION ===';
    FOR qr_record IN SELECT id, name, event_date, points FROM events ORDER BY event_date DESC LIMIT 5
    LOOP
        RAISE NOTICE 'Event: % (ID: %), Date: %, Points: %', qr_record.name, qr_record.id, qr_record.event_date, qr_record.points;
    END LOOP;

    -- Test the URL format that should be generated
    DECLARE
        test_token TEXT;
        test_url TEXT;
    BEGIN
        SELECT token INTO test_token FROM event_qr_codes LIMIT 1;
        IF test_token IS NOT NULL THEN
            test_url := 'http://localhost:5173/checkin/' || test_token; -- Adjust for your dev server
            RAISE NOTICE 'Expected QR URL format: %', test_url;
        END IF;
    END;
END $$;