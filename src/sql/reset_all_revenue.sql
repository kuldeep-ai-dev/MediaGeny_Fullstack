-- WARNING: This will delete ALL recorded payments and reset ALL invoices to 'Sent' (Unpaid).
-- This will result in 0 Revenue in the analytics.

BEGIN;

-- 1. Delete all payment records
DELETE FROM invoice_payments;

-- 2. Reset details on Invoices
UPDATE invoices
SET 
    status = 'Sent',
    amount_paid = 0,
    grand_total = subtotal + gst_total; -- Ensure integrity if needed, though usually fine.

COMMIT;
