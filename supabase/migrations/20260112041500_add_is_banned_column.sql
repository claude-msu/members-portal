-- Add is_banned column to profiles table
-- This allows us to ban users by marking their profile as banned
ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN profiles.is_banned IS 'Whether this user account is banned from accessing the application';

-- Create an index on is_banned for efficient queries
CREATE INDEX idx_profiles_is_banned ON profiles(is_banned) WHERE is_banned = true;