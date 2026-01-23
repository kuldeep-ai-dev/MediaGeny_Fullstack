-- Run this in your Supabase SQL Editor

create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references clients(id) on delete cascade not null,
  service_name text not null,
  monthly_rate numeric not null,
  billing_cycle_day integer not null check (billing_cycle_day between 1 and 31),
  gst_rate integer default 18,
  status text default 'Active',
  last_invoice_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table subscriptions enable row level security;

-- Create Policies (Adjust based on your actual auth requirements)
-- For now, allowing full access to authenticated/anon users to match existing patterns if any
create policy "Enable read access for all users" on subscriptions for select using (true);
create policy "Enable insert for all users" on subscriptions for insert with check (true);
create policy "Enable update for all users" on subscriptions for update using (true);
create policy "Enable delete for all users" on subscriptions for delete using (true);
