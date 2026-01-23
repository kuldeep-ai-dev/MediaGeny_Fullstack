-- Company Profile Table (Singleton)
create table if not exists company_profile (
  id integer primary key default 1, -- Force single row
  story text,
  mission text,
  vision text,
  founder_name text,
  founder_bio text,
  founder_image text,
  -- Contact Info
  address text,
  phone text,
  email text,
  map_embed_url text, -- Google Maps iframe src
  -- Stats
  stat_projects integer default 100,
  stat_clients integer default 50,
  stat_years integer default 5,
  stat_team integer default 10,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint single_row check (id = 1)
);

-- Team Members Table
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  image_url text,
  bio text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Legal Documents Table
create table if not exists legal_documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  file_url text not null,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table company_profile enable row level security;
alter table team_members enable row level security;
alter table legal_documents enable row level security;

create policy "Public view profile" on company_profile for select using (true);
create policy "Admin manage profile" on company_profile for all using (true);

create policy "Public view team" on team_members for select using (true);
create policy "Admin manage team" on team_members for all using (true);

create policy "Public view legal" on legal_documents for select using (true);
create policy "Admin manage legal" on legal_documents for all using (true);

-- Insert default row for profile if not exists
insert into company_profile (id, story, mission, vision) 
values (
  1, 
  'Initial story content...', 
  'Initial mission statement...', 
  'Initial vision statement...'
) on conflict (id) do nothing;
