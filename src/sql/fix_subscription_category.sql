-- Fix existing invoices that were created as Subscriptions but have the wrong category
update invoices
set invoice_category = 'Subscription Invoice'
where notes like 'Monthly subscription for%';
