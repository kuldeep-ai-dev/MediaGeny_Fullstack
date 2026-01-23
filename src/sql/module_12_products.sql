-- Module 12: Products CMS Schema

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_description TEXT, -- For Hero & Lists
    full_description TEXT, -- For main content
    hero_image_url TEXT,
    demo_link TEXT, -- "Schedule Demo" button target
    trust_client_count INTEGER DEFAULT 0, -- "Trusted by X clients"
    
    -- JSONB Columns for rich structured content
    features JSONB DEFAULT '[]'::jsonb, 
    -- Structure: [{ "title": "Feature Name", "description": "Details", "icon": "Shield" }]
    
    key_highlights JSONB DEFAULT '[]'::jsonb, 
    -- Structure: ["24/7 Support", "Mobile Ready", "Regular Updates"]
    
    success_stories JSONB DEFAULT '[]'::jsonb, 
    -- Structure: [{ "client": "Acme Corp", "quote": "Amazing product!", "result": "200% Growth" }]
    
    meta_title TEXT,
    meta_description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Open Read, Admin Write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" 
ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update products" 
ON products FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete products" 
ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
