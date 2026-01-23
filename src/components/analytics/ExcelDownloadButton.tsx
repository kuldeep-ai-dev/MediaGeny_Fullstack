"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { getInvoices } from "@/actions/invoice-actions"
import { useState } from "react"
import { formatCurrency, formatDate } from "@/lib/invoice-utils"

export function ExcelDownloadButton() {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)
        try {
            const { data: invoices, success } = await getInvoices()
            if (!success || !invoices) {
                alert("Failed to fetch data")
                return
            }

            // Define stats
            const csvRows = []

            // Header
            csvRows.push(["Invoice Number", "Date", "Client", "Company", "Status", "Amount", "GST"].join(","))

            // Rows
            invoices.forEach((inv: any) => {
                const row = [
                    inv.invoice_number,
                    formatDate(inv.created_at),
                    // @ts-ignore
                    `"${inv.clients?.name || ''}"`,
                    // @ts-ignore
                    `"${inv.clients?.company_name || ''}"`,
                    inv.status,
                    inv.grand_total,
                    // GST is not directly stored as total, but we can approximate or just leave blank if not vital
                    ""
                ]
                csvRows.push(row.join(","))
            })

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n")
            const encodedUri = encodeURI(csvContent)
            const link = document.createElement("a")
            link.setAttribute("href", encodedUri)
            link.setAttribute("download", `invoices_export_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

        } catch (error) {
            console.error(error)
            alert("Error exporting CSV")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant="outline" onClick={handleDownload} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
    )
}
