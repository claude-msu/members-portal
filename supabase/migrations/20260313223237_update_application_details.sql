-- Remove redundant application fields: name and class year are derived from profile (user_id).
-- This simplifies the form and relies on the embedded profile viewer for member details.

ALTER TABLE public.applications
  DROP COLUMN IF EXISTS full_name,
  DROP COLUMN IF EXISTS class_year;
