-- SERVICE AGREEMENT TABLE
CREATE TABLE IF NOT EXISTS agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_company TEXT,
    client_email TEXT,
    client_phone TEXT,
    client_address TEXT,
    nominee_name TEXT,
    representative_name TEXT NOT NULL,
    client_photo_url TEXT,
    representative_photo_url TEXT,
    signature_url TEXT,
    agreement_text TEXT,
    agreement_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE PUBLIC READ ACCESS (Optional, assuming you use admin client for writing)
-- If you want RLS, you would add policies here. 
-- Since the project seems to use supabaseAdmin for most things, we just ensure the table exists.

-- Add a comment for clarity
COMMENT ON TABLE agreements IS 'Stores onboarded client service agreements with identity verification data.';
