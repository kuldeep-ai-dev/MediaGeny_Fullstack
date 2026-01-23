
import { getInvoice, getBusinessProfile } from "@/actions/invoice-actions"
import { InvoicePDFView } from "@/components/invoice/InvoicePDFView"
import { DownloadPDFButton } from "@/components/invoice/DownloadPDFButton"
import { ShareButtons } from "@/components/invoice/ShareButtons"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function InvoiceDetailsPage({ params }: { params: { id: string } }) {

    // In Next.js 15, params is a Promise. Need to await it.
    // However, the type definition in some versions is strictly object.
    // We will handle it by awaiting if it's a promise or accessing directly.
    // Since this is a server component, safest way is to treat it as possibly async in future.
    // For now in 14/15 stable, it's usually `params: { id: string }` but let's assume standard access first.

    const { id } = await params; // Await params for Next.js 15 compatibility

    const [invoiceRes, profileRes] = await Promise.all([
        getInvoice(id),
        getBusinessProfile()
    ])

    if (!invoiceRes.success || !invoiceRes.data) {
        return notFound()
    }

    const invoice = invoiceRes.data
    const profile = profileRes.data

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/invoices">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Invoice Details</h1>
                </div>
                <div className="flex gap-2">
                    <ShareButtons
                        invoiceNumber={invoice.invoice_number}
                        clientName={invoice.client?.name || "Client"}
                        amount={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(invoice.grand_total) || 0)}
                    />
                    <DownloadPDFButton
                        targetId="invoice-pdf-view"
                        fileName={`Invoice_${invoice.invoice_number}.pdf`}
                    />
                </div>
            </div>

            <div className="border rounded-xl overflow-hidden shadow-sm">
                <InvoicePDFView
                    id="invoice-pdf-view"
                    invoice={invoice}
                    businessProfile={profile}
                />
            </div>
        </div>
    )
}
