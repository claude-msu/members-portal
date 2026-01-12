-- Test the checkin function with the existing QR code
DO $$
DECLARE
    test_token TEXT;
    test_result JSONB;
    auth_uid UUID;
BEGIN
    -- Get the existing token
    SELECT token INTO test_token FROM event_qr_codes LIMIT 1;

    IF test_token IS NOT NULL THEN
        RAISE NOTICE 'Found token: %', test_token;

        -- Try to call the function (this will fail without auth context, but let's see the error)
        BEGIN
            SELECT checkin_user_for_event(test_token) INTO test_result;
            RAISE NOTICE 'Function call result: %', test_result;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Function call failed as expected (no auth): %', SQLERRM;
        END;

        -- Just verify the token exists in the table
        IF EXISTS (SELECT 1 FROM event_qr_codes WHERE token = test_token) THEN
            RAISE NOTICE 'Token exists in database and should be valid';
        ELSE
            RAISE NOTICE 'ERROR: Token does not exist in database!';
        END IF;
    ELSE
        RAISE NOTICE 'No tokens found in database';
    END IF;
END $$;