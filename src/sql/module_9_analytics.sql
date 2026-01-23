-- Add category column to invoices
alter table invoices 
add column if not exists invoice_category text default 'One-Time Service';

-- Update existing subscriptions to have the correct category if traceable
-- (Optional: if we can link them back, but for now default is fine)

-- Create index for faster analytics
create index if not exists idx_invoices_category on invoices(invoice_category);
create index if not exists idx_invoices_date on invoices(created_at);
