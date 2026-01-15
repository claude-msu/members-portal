-- This migration changes the "updated_at" column on the "profiles" table so it no longer has a default value,
-- and allows NULL values (previously, it would default to the current timestamp and could not be null).

ALTER TABLE profiles
  -- Remove the default "now()" value for 'updated_at'; new rows will have NULL unless explicitly set
  ALTER COLUMN updated_at DROP DEFAULT,
  -- Allow 'updated_at' to be NULL (it was previously NOT NULL)
  ALTER COLUMN updated_at DROP NOT NULL;