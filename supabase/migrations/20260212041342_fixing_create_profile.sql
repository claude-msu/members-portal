-- Drop trigger first, then function, then recreate both
DROP TRIGGER IF EXISTS on_email_confirmation ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile();

CREATE OR REPLACE FUNCTION public.create_profile()
RETURNS trigger AS $$
DECLARE
  matching_semester_code TEXT := NULL;
  confirmation_date DATE;
BEGIN
  -- Only proceed if email was just confirmed (changed from NULL to non-NULL)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN

    RAISE NOTICE 'Email confirmed for user %', NEW.id;

    -- Get the confirmation date for term calculation
    BEGIN
      confirmation_date := NEW.email_confirmed_at::date;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Invalid email_confirmed_at timestamp for user %, setting term_joined to NULL: %', NEW.id, SQLERRM;
        confirmation_date := NULL;
    END;

    -- Find the matching semester if we have a valid date
    IF confirmation_date IS NOT NULL THEN
      BEGIN
        SELECT s.code INTO matching_semester_code
        FROM public.semesters s
        WHERE confirmation_date >= (s.start_date - INTERVAL '1 month')::date
          AND confirmation_date <= s.end_date::date
        ORDER BY s.start_date DESC
        LIMIT 1;

        IF matching_semester_code IS NOT NULL THEN
          RAISE NOTICE 'Assigned term_joined = % for user % (confirmed: %)',
                       matching_semester_code, NEW.id, confirmation_date;
        END IF;

      EXCEPTION
        WHEN OTHERS THEN
          matching_semester_code := NULL;
          RAISE WARNING 'Failed to determine term_joined for user % (confirmed: %): %',
                        NEW.id, confirmation_date, SQLERRM;
      END;
    END IF;

    -- Create profile for the confirmed user
    INSERT INTO public.profiles (id, email, full_name, points, term_joined)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      0,
      matching_semester_code
    )
    ON CONFLICT (id) DO NOTHING;

    -- Create default role - use correct constraint name
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'prospect')
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE 'Successfully created profile and role for confirmed user %', NEW.id;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Recreate trigger
CREATE TRIGGER on_email_confirmation
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.create_profile();

GRANT EXECUTE ON FUNCTION public.create_profile() TO service_role;

COMMENT ON FUNCTION public.create_profile() IS
  'Automatically creates profile and assigns prospect role when user confirms email. Also sets term_joined based on confirmation date.';