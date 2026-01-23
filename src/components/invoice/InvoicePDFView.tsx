
import { formatCurrency } from "@/lib/invoice-utils"

interface InvoicePDFViewProps {
    invoice: any;
    businessProfile: any;
    id?: string;
}

export function InvoicePDFView({ invoice, businessProfile, id }: InvoicePDFViewProps) {
    if (!invoice || !businessProfile) return null;

    const items = invoice.invoice_items || [];
    const client = invoice.clients;

    const subtotal = Number(invoice.subtotal) || 0;
    const gstTotal = Number(invoice.gst_total) || 0;
    const grandTotal = Number(invoice.grand_total) || 0;
    const amountPaid = Number(invoice.amount_paid) || 0;
    const balanceDue = grandTotal - amountPaid; // Calculate dynamically or use invoice.balance_due

    return (
        <div id={id} className="bg-white text-black p-8 max-w-[800px] mx-auto text-sm leading-relaxed">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    {businessProfile.logo_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={businessProfile.logo_url} alt="Logo" className="h-12 w-auto mb-4 object-contain" />
                    )}
                    <h1 className="text-2xl font-bold text-primary">{businessProfile.agency_name}</h1>
                    <div className="text-gray-500 mt-2 text-xs">
                        <p>{businessProfile.address}</p>
                        <p>{businessProfile.email} | {businessProfile.phone}</p>
                        <p>GSTIN: {businessProfile.gst_number}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-gray-200 uppercase tracking-widest">Invoice</h2>
                    <div className="mt-4 space-y-1">
                        <p className="font-semibold text-base"># {invoice.invoice_number}</p>
                        <p className="text-gray-500">Date: {new Date(invoice.date).toLocaleDateString()}</p>
                        {invoice.due_date && <p className="text-gray-500">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>}
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                <p className="text-lg font-bold">{client?.company_name || client?.name}</p>
                <div className="text-gray-500 mt-1">
                    <p>{client?.billing_address}</p>
                    <p>GSTIN: {client?.gst_number}</p>
                    <p>State: {client?.state}</p>
                </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-gray-100 text-left">
                        <th className="py-3 font-semibold text-gray-600">Items</th>
                        <th className="py-3 font-semibold text-gray-600 text-center">Qty</th>
                        <th className="py-3 font-semibold text-gray-600 text-right">Price</th>
                        <th className="py-3 font-semibold text-gray-600 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: any) => (
                        <tr key={item.id} className="border-b border-gray-50">
                            <td className="py-4">
                                <p className="font-medium text-gray-900">{item.service_name}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{item.description}</p>
                            </td>
                            <td className="py-4 text-center text-gray-500">{Number(item.quantity) || 0}</td>
                            <td className="py-4 text-right text-gray-500">{formatCurrency(Number(item.rate) || 0)}</td>
                            <td className="py-4 text-right font-medium text-gray-900">{formatCurrency(Number(item.amount) || Number(item.quantity || 0) * Number(item.rate || 0))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>GST ({invoice.gst_rate}%)</span>
                        <span>{formatCurrency(gstTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-100">
                        <span>Total</span>
                        <span>{formatCurrency(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 text-sm pt-1">
                        <span>Paid</span>
                        <span>{formatCurrency(amountPaid)}</span>
                    </div>
                    <div className="flex justify-between text-red-600 font-medium pt-1">
                        <span>Balance Due</span>
                        <span>{formatCurrency(balanceDue)}</span>
                    </div>
                </div>
            </div>

            {/* Footer / Bank Info */}
            <div className="border-t border-gray-100 pt-8 flex justify-between items-end">
                <div className="text-xs text-gray-500 space-y-1">
                    <p className="font-bold text-gray-700 uppercase mb-2">Bank Details</p>
                    <p>Bank: {businessProfile.bank_name}</p>
                    <p>Account: {businessProfile.account_number}</p>
                    <p>IFSC: {businessProfile.ifsc_code}</p>
                    {businessProfile.upi_id && <p>UPI: {businessProfile.upi_id}</p>}
                </div>
                {businessProfile.signature_url && (
                    <div className="text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={businessProfile.signature_url} alt="Signature" className="h-16 w-auto mb-2 object-contain mx-auto" />
                        <p className="text-xs text-gray-400">Authorized Signature</p>
                    </div>
                )}
            </div>
            {/* Notes / Terms */}
            {(invoice.notes || invoice.terms) && (
                <div className="mt-8 pt-8 border-t border-gray-100 text-xs text-gray-500">
                    {invoice.notes && <div className="mb-4"><span className="font-bold text-gray-700">Notes:</span> {invoice.notes}</div>}
                    {invoice.terms && <div><span className="font-bold text-gray-700">Terms:</span> {invoice.terms}</div>}
                </div>
            )}
        </div>
    )
}
