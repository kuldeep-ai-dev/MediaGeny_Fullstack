CREATE TABLE IF NOT EXISTS site_stats (
    id SERIAL PRIMARY KEY,
    views_count INTEGER DEFAULT 0,
    views_change TEXT DEFAULT '+0%',
    leads_count INTEGER DEFAULT 0,
    leads_change TEXT DEFAULT '+0',
    engagement_rate TEXT DEFAULT '0%',
    engagement_change TEXT DEFAULT '+0%',
    bounce_rate TEXT DEFAULT '0%',
    bounce_change TEXT DEFAULT '0%',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row if not exists
INSERT INTO site_stats (id, views_count, views_change, leads_count, leads_change, engagement_rate, engagement_change, bounce_rate, bounce_change)
VALUES (1, 45200, '+20.1% from last month', 573, '+201 since last week', '12.5%', '+2.4% from last month', '42.3%', '-1.2% from last month')
ON CONFLICT (id) DO NOTHING;
