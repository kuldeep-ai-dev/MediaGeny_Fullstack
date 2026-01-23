-- Enhanced SEO Table
create table if not exists page_seo (
    page_key text primary key, -- 'home', 'about', etc.
    title text,
    description text,
    keywords text,
    
    -- Open Graph / Social
    og_title text,
    og_description text,
    og_image text,
    
    -- Advanced
    canonical_url text, -- Auto-generated if null, but allow override
    robots_meta text default 'index, follow', -- 'noindex, nofollow' etc.
    
    -- Structured Data
    schema_markup jsonb default '{}'::jsonb,
    geo_location text,
    
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table page_seo enable row level security;

-- Public Read
create policy "Public pages are viewable by everyone" 
on page_seo for select 
using (true);

-- Admin Full Access
create policy "Admin full access" 
on page_seo for all 
using (true); -- Simplified for now, or match auth.uid check

-- Initial Seed for Home
insert into page_seo (page_key, title, description, robots_meta)
values ('home', 'Home Page', 'Welcome to our website.', 'index, follow')
on conflict (page_key) do nothing;
