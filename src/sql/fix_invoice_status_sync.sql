-- 1. Reset all invoices to 'Sent' and 0 paid initially (easiest baseline)
-- Note: In a real prod DB we might be more careful, but user said "everything should be zero"
-- Better approach: Recalculate from payments table.

with calculated_payments as (
  select invoice_id, sum(amount) as total_paid
  from invoice_payments
  group by invoice_id
)
update invoices
set 
  amount_paid = coalesce(cp.total_paid, 0),
  status = case 
    when coalesce(cp.total_paid, 0) >= (grand_total - 0.5) then 'Paid'
    else 'Sent'
  end
from invoices i
left join calculated_payments cp on cp.invoice_id = i.id
where invoices.id = i.id;

-- Force status to 'Sent' for anything with 0 payments (just to be sure if the above join misses nulls)
update invoices
set status = 'Sent', amount_paid = 0
where id not in (select distinct invoice_id from invoice_payments);
