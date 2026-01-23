-- Module 42: Admin Credentials
-- Creates table for dynamic admin configuration (Email/Password)

-- 1. Create Table if not exists
create table if not exists admin_config (
    key text primary key,
    value text not null,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Seed Default Credentials (if not exists)
-- Default User: admin@mediageny.com
-- Default Pass: admin123
insert into admin_config (key, value)
values 
    ('admin_email', 'kuldeep@mediageny.com'),
    ('admin_password', '787059')
on conflict (key) do nothing;

-- 3. Enable RLS (Optional but good practice)
alter table admin_config enable row level security;

-- 4. Policies (Only service role should access this usually, but for simplicity in this setup we might expose reading to authenticated)
-- Actually, only Server Actions use this via Service Role, so we don't strictly need public policies.
-- But to be safe if client accesses:
create policy "Allow Service Role" on admin_config
    using (true)
    with check (true);
