-- Add new columns for secondary phone and social media links
ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS phone_2 TEXT;
ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS social_twitter TEXT;
ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS social_linkedin TEXT;
ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS social_instagram TEXT;
ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS social_facebook TEXT;
