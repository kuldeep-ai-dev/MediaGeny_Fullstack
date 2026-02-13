-- Run this in your Supabase SQL Editor
-- Payment history table for tracking all subscription payments

create table if not exists subscription_payments (
  id uuid default gen_random_uuid() primary key,
  subscription_id uuid references software_subscriptions(id) on delete cascade not null,
  amount numeric not null,
  payment_date timestamptz default now(),
  period_start timestamptz not null,
  period_end timestamptz not null,
  payment_method text default 'online',
  transaction_id text,
  status text default 'pending', -- 'pending', 'completed', 'failed'
  notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table subscription_payments enable row level security;

-- Policies
create policy "Enable full access for authenticated users" on subscription_payments for all using (true);
create policy "Enable read for everyone" on subscription_payments for select using (true);
