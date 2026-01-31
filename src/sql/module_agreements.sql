-- Create agreements table
CREATE TABLE IF NOT EXISTS agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    agreement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    agreement_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
