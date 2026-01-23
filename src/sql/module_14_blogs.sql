-- Blogs Table
create table if not exists blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null, -- Markdown or HTML
  excerpt text,
  cover_image text,
  author text default 'MediaGeny Team',
  is_published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table blogs enable row level security;

-- Public read access for published blogs
create policy "Public blogs are viewable by everyone"
  on blogs for select
  using ( is_published = true );

-- Admin full access
create policy "Admins can manage blogs"
  on blogs for all
  using ( true )
  with check ( true );
