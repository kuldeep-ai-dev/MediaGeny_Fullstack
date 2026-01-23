import { formatCurrency, formatDate } from "@/lib/invoice-utils"
import { Users, DollarSign, Receipt, CreditCard } from "lucide-react"

export function ReportTemplate({ data }: { data: any }) {
    if (!data) return null

    const { profile, period, summary, gst, clients, paymentMethods, invoices } = data

    return (
        <div className="bg-white p-8 max-w-5xl mx-auto print:p-0 print:max-w-none text-black">
            {/* HEADER */}
            <div className="flex justify-between items-start border-b pb-6 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile?.company_name || "MediaGeny"}</h1>
                    <h2 className="text-xl text-gray-600">Business Performance Report</h2>
                    <p className="text-sm text-gray-500 mt-1">Generated on {formatDate(new Date().toISOString())}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-gray-800">Report Period</p>
                    <p className="text-gray-600">{formatDate(period.from)} - {formatDate(period.to)}</p>
                </div>
            </div>

            {/* EXECUTIVE SUMMARY */}
            <section className="mb-8">
                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b">1. Executive Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-xs text-gray-500 uppercase">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.revenue)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-xs text-gray-500 uppercase">GST Collected</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.gst)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-xs text-gray-500 uppercase">Total Invoices</p>
                        <p className="text-2xl font-bold text-blue-600">{summary.invoicesCount}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-xs text-gray-500 uppercase">Paid Ratio</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {summary.invoicesCount ? ((summary.paidCount / summary.invoicesCount) * 100).toFixed(0) : 0}%
                        </p>
                    </div>
                </div>
            </section>

            {/* GST BREAKDOWN */}
            <section className="mb-8 break-inside-avoid">
                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b">2. GST Compliance</h3>
                <table className="w-full text-sm border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Tax Type</th>
                            <th className="border p-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border p-2">CGST (Central Tax)</td>
                            <td className="border p-2 text-right">{formatCurrency(gst.cgst)}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">SGST (State Tax)</td>
                            <td className="border p-2 text-right">{formatCurrency(gst.sgst)}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">IGST (Inter-State Tax)</td>
                            <td className="border p-2 text-right">{formatCurrency(gst.igst)}</td>
                        </tr>
                        <tr className="font-bold bg-gray-50">
                            <td className="border p-2">Total Tax Liability</td>
                            <td className="border p-2 text-right">{formatCurrency(summary.gst)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* TOP CLIENTS */}
            <section className="mb-8 break-inside-avoid">
                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b">3. Top Client Insights</h3>
                <table className="w-full text-sm border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Client Name</th>
                            <th className="border p-2 text-left">Email</th>
                            <th className="border p-2 text-right">Invoices</th>
                            <th className="border p-2 text-right">Revenue Contributed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c: any, i: number) => (
                            <tr key={i}>
                                <td className="border p-2 font-medium">{c.name}</td>
                                <td className="border p-2 text-gray-500">{c.email}</td>
                                <td className="border p-2 text-right">{c.count}</td>
                                <td className="border p-2 text-right">{formatCurrency(c.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* REVENUE BY PAYMENT MODE */}
            <section className="mb-8 break-inside-avoid">
                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b">4. Payment Methods</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(paymentMethods).map(([method, amount]: any) => (
                        <div key={method} className="border p-3 rounded">
                            <p className="text-xs text-gray-500 capitalize">{method}</p>
                            <p className="font-bold">{formatCurrency(amount)}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* INVOICE LIST */}
            <section className="break-before-page">
                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b">5. Invoice Register</h3>
                <table className="w-full text-xs border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-1 text-left">Date</th>
                            <th className="border p-1 text-left">Inv #</th>
                            <th className="border p-1 text-left">Client</th>
                            <th className="border p-1 text-left">Type</th>
                            <th className="border p-1 text-right">Status</th>
                            <th className="border p-1 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv: any) => (
                            <tr key={inv.id}>
                                <td className="border p-1">{formatDate(inv.created_at)}</td>
                                <td className="border p-1">{inv.invoice_number}</td>
                                <td className="border p-1 truncate max-w-[150px]">
                                    {/* @ts-ignore */}
                                    {inv.clients?.company_name || inv.clients?.name}
                                </td>
                                <td className="border p-1">{inv.invoice_category || "Standard"}</td>
                                <td className="border p-1 text-right">{inv.status}</td>
                                <td className="border p-1 text-right">{formatCurrency(inv.grand_total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    )
}
