-- Forcefully reset ANY invoice that has NO payments recorded
-- This ensures that if the Payments table is empty, ALL invoices become 'Sent' (Unpaid).

UPDATE invoices
SET 
  status = 'Sent',
  amount_paid = 0
WHERE id NOT IN (
    SELECT DISTINCT invoice_id FROM invoice_payments
);

-- Verification: The result of this query should be 0 rows if everything is correct
SELECT * FROM invoices WHERE status = 'Paid' AND id NOT IN (SELECT invoice_id FROM invoice_payments);
