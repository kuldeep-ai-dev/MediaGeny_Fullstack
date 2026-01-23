-- Appointments / Inquiries Table
create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  service_type text, -- Optional now, as product inquiries might not have this
  preferred_date date, -- Optional
  message text,
  -- New Fields for Unified System
  inquiry_source text default 'Contact Page', -- e.g. "Contact Page", "Product: School System"
  inquiry_type text default 'General', -- e.g. "Appointment", "Quote", "General"
  
  status text default 'pending' check (status in ('pending', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table appointments enable row level security;

-- Public insert
create policy "Public can request appointment"
  on appointments for insert
  with check ( true );

-- Admin full access
create policy "Admins can manage appointments"
  on appointments for all
  using ( true )
  with check ( true );
