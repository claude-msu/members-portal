-- Migration: Change LinkedIn URL to username and add GitHub username
-- This migration updates the profiles table to store usernames instead of full URLs

-- Add github_username column
ALTER TABLE public.profiles
ADD COLUMN github_username TEXT;

-- Rename linkedin_url to linkedin_username
ALTER TABLE public.profiles
RENAME COLUMN linkedin_url TO linkedin_username;

-- Optional: Add comment to columns for clarity
COMMENT ON COLUMN public.profiles.linkedin_username IS 'LinkedIn username/handle (not full URL)';
COMMENT ON COLUMN public.profiles.github_username IS 'GitHub username/handle (not full URL)';

-- Note: If you need to migrate existing data from URLs to usernames, you can run:
-- UPDATE public.profiles
-- SET linkedin_username = REGEXP_REPLACE(linkedin_username, '.*linkedin\.com/in/([^/]+).*', '\1')
-- WHERE linkedin_username LIKE '%linkedin.com%';