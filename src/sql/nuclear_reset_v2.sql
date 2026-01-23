-- EXECUTE THESE COMMANDS ONE BY ONE IF "RUN" FAILS, OR RUN ALL AT ONCE.

-- 1. Wipe all payment history.
TRUNCATE TABLE invoice_payments;

-- 2. Force reset ALL invoices to 'Sent' (Unpaid) and 0 paid.
UPDATE invoices
SET 
    status = 'Sent',
    amount_paid = 0;

-- 3. (Optional) If you want to delete ALL invoices too, uncomment the next line:
-- DELETE FROM invoices;
