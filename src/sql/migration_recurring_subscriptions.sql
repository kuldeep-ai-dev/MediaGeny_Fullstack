-- Migration: Update software_subscriptions for recurring payments
-- Run this in your Supabase SQL Editor

-- Step 1: Add new columns
ALTER TABLE software_subscriptions 
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS amount_per_period numeric,
  ADD COLUMN IF NOT EXISTS subscription_period_days integer DEFAULT 30,
  ADD COLUMN IF NOT EXISTS current_period_start timestamptz,
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS auto_renew boolean DEFAULT false;

-- Step 2: Migrate existing data from 'amount' to 'amount_per_period'
UPDATE software_subscriptions 
SET amount_per_period = COALESCE(amount, 0),
    subscription_period_days = 30
WHERE amount_per_period IS NULL;

-- Step 3: Drop the old 'amount' column (after data is migrated)
ALTER TABLE software_subscriptions 
  DROP COLUMN IF EXISTS amount;

-- Step 4: Drop the old 'payment_date' column (moved to payments table)
ALTER TABLE software_subscriptions 
  DROP COLUMN IF EXISTS payment_date;

-- Step 5: Update status values
UPDATE software_subscriptions 
SET status = 'active' 
WHERE status = 'paid';

-- Step 6: Create subscription_payments table if not exists
CREATE TABLE IF NOT EXISTS subscription_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id uuid REFERENCES software_subscriptions(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  payment_date timestamptz DEFAULT now(),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  payment_method text DEFAULT 'online',
  transaction_id text,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Step 7: Enable RLS on subscription_payments
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

-- Step 8: Create policies for subscription_payments
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON subscription_payments;
CREATE POLICY "Enable full access for authenticated users" 
  ON subscription_payments FOR ALL 
  USING (true);

DROP POLICY IF EXISTS "Enable read for everyone" ON subscription_payments;
CREATE POLICY "Enable read for everyone" 
  ON subscription_payments FOR SELECT 
  USING (true);

-- Done! Your database is now ready for recurring subscriptions.
