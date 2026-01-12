-- Regenerate QR codes with correct base URL
-- This migration will delete existing QR codes so they can be regenerated with the correct URL

DO $$
DECLARE
    qr_record RECORD;
    deleted_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Regenerating QR codes with correct base URL...';

    -- Delete existing QR code files from storage (this is handled by the event trigger)
    -- and delete the QR code records
    FOR qr_record IN SELECT * FROM event_qr_codes
    LOOP
        -- Delete from storage if the URL exists
        IF qr_record.qr_code_url IS NOT NULL THEN
            -- Extract file path from URL
            -- URL format: https://domain.supabase.co/storage/v1/object/public/events/qr-codes/filename.png
            -- We need: qr-codes/filename.png
            DECLARE
                file_path TEXT;
            BEGIN
                file_path := substring(qr_record.qr_code_url from 'qr-codes/[^?]+');
                IF file_path IS NOT NULL THEN
                    -- Delete file from storage
                    PERFORM storage.delete('events', file_path);
                END IF;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not delete file: %', qr_record.qr_code_url;
            END;
        END IF;

        deleted_count := deleted_count + 1;
    END LOOP;

    -- Delete all QR code records - they will be regenerated with correct URLs
    DELETE FROM event_qr_codes;

    RAISE NOTICE 'Deleted % QR code records. Please regenerate QR codes for events from the dashboard.', deleted_count;
END $$;