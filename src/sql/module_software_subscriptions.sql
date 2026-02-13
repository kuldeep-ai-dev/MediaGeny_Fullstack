-- Run this in your Supabase SQL Editor
-- Updated schema for recurring subscription system

create table if not exists software_subscriptions (
  id uuid default gen_random_uuid() primary key,
  software_id text unique not null,
  software_name text not null,
  customer_name text not null,
  customer_email text,
  amount_per_period numeric not null,
  subscription_period_days integer not null default 30,
  access_password text not null,
  status text default 'active', -- 'active', 'expired', 'cancelled'
  current_period_start timestamptz,
  current_period_end timestamptz,
  auto_renew boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table software_subscriptions enable row level security;

-- Policies
create policy "Enable full access for authenticated users" on software_subscriptions for all using (true);
create policy "Enable read by software_id for everyone" on software_subscriptions for select using (true);
create policy "Enable update for everyone" on software_subscriptions for update using (true);
