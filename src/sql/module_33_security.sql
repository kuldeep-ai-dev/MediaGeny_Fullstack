-- Create a table to store admin configuration including password hash
create table if not exists admin_config (
    key text primary key,
    value text,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default admin password (if not exists)
-- Default: 'admin123' hashed (using pgcrypto or raw string if simple)
-- Since we might not have pgcrypto, we will store it as plain text initially or simple hash handled by app.
-- For higher security, we should handle hashing in the Next.js Action using bcrypt/argon2. 
-- Here we'll just insert a row for 'admin_password'.
insert into admin_config (key, value)
values ('admin_password', '$2a$10$X7.X7.X7.X7.X7.X7.X7.X7.X7.X7.X7') -- Placeholder, will be set on init or use logic
on conflict (key) do nothing;

-- Actually, let's keep it simple. We will store the *current* hardcoded password as the initial DB value so we don't lock the user out.
-- We will migrate the "const" logic to DB logic.
-- The APP will handle the hashing. We just prepare the storage.
