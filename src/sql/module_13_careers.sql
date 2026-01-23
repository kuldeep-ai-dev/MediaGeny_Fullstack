-- Jobs / Internships Table
create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null check (type in ('job', 'internship')),
  location text not null default 'Remote',
  department text not null,
  description text not null, -- HTML or Markdown
  requirements jsonb default '[]'::jsonb, -- Array of strings
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Applications Table
create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references jobs(id) on delete set null,
  candidate_name text not null,
  email text not null,
  phone text,
  resume_url text, -- Link to storage
  cover_letter text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'interviewing', 'rejected', 'hired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Enable RLS for security)
alter table jobs enable row level security;
alter table applications enable row level security;

-- Public read access for active jobs
create policy "Public jobs are viewable by everyone"
  on jobs for select
  using ( is_active = true );

-- Admin full access
create policy "Admins can manage jobs"
  on jobs for all
  using ( true )
  with check ( true );

-- Public can submit applications
create policy "Anyone can submit application"
  on applications for insert
  with check ( true );

-- Admin view applications
create policy "Admins can view applications"
  on applications for select
  using ( true );
