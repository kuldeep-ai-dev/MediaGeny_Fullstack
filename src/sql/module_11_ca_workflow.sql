-- Add CA Email to Business Profile
alter table business_profile
add column if not exists ca_email text;

-- Add CA Tracking to Invoices
alter table invoices
add column if not exists sent_to_ca_at timestamptz;
