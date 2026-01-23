-- Testimonials Table
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  client_name text not null,
  client_role text,
  content text not null,
  rating integer check (rating >= 1 and rating <= 5),
  image_url text,
  is_featured boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table testimonials enable row level security;

-- Public read for featured
create policy "Public view featured testimonials"
  on testimonials for select
  using ( is_featured = true );

-- Public insert (for /rate-us page)
create policy "Public insert testimonials"
  on testimonials for insert
  with check ( true );

-- Admin full access
create policy "Admins can manage testimonials"
  on testimonials for all
  using ( true )
  with check ( true );
