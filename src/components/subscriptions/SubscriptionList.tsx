"use client"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/invoice-utils"
import { Loader2, Play, Trash2 } from "lucide-react"
import { useState } from "react"
import { deleteSubscription, generateInvoiceFromSubscription } from "@/actions/invoice-actions"
import { useRouter } from "next/navigation"

export function SubscriptionList({ subscriptions }: { subscriptions: any[] }) {
    const [generatingId, setGeneratingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter()

    const handleGenerate = async (id: string) => {
        setGeneratingId(id)
        try {
            const res = await generateInvoiceFromSubscription(id)
            if (res.success) {
                alert("Invoice generated successfully!")
                router.push(`/admin/invoices/${res.invoiceId}`)
            } else {
                alert("Error: " + res.error)
            }
        } catch (error) {
            console.error(error)
            alert("Failed to generate invoice")
        } finally {
            setGeneratingId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subscription?")) return
        setDeletingId(id)
        try {
            const res = await deleteSubscription(id)
            if (!res.success) {
                alert("Error: " + res.error)
            }
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Billing Day</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Last Invoice</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                            <TableCell className="font-medium">
                                {sub.clients?.company_name || sub.clients?.name}
                            </TableCell>
                            <TableCell>{sub.service_name}</TableCell>
                            <TableCell>Day {sub.billing_cycle_day}</TableCell>
                            <TableCell>{formatCurrency(sub.monthly_rate)}</TableCell>
                            <TableCell>{sub.last_invoice_date ? formatDate(sub.last_invoice_date) : "Never"}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerate(sub.id)}
                                    disabled={!!generatingId}
                                >
                                    {generatingId === sub.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Play className="mr-2 h-4 w-4" /> Generate
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(sub.id)}
                                    disabled={!!deletingId}
                                >
                                    {deletingId === sub.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {subscriptions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No active subscriptions.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
