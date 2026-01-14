-- Add theme column to profiles table to store user theme preference
ALTER TABLE profiles ADD COLUMN theme text DEFAULT 'light';

-- Add constraint to ensure theme is either 'dark' or 'light'
ALTER TABLE profiles ADD CONSTRAINT theme_check CHECK (theme IN ('dark', 'light'));