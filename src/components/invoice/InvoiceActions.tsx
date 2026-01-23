
"use client"

import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, Trash2, CreditCard, Send, Mail } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { markInvoiceAsPaid, deleteInvoice } from "@/actions/invoice-actions"
import { useRouter } from "next/navigation"

interface InvoiceActionsProps {
    invoice: any;
    caEmail?: string;
}

export function InvoiceActions({ invoice, caEmail }: InvoiceActionsProps) {
    const [isPayDialogOpen, setIsPayDialogOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("UPI")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleMarkAsPaid = async () => {
        setIsLoading(true)
        const result = await markInvoiceAsPaid(invoice.id, invoice.grand_total, paymentMethod)
        setIsLoading(false)
        if (result.success) {
            setIsPayDialogOpen(false)
            // router.refresh() // Actions usually revalidatePath, but refresh ensures client update
        } else {
            alert("Failed to record payment: " + result.error)
        }
    }

    const handleSendToCA = async () => {
        const res = await import("@/actions/invoice-actions").then(mod => mod.markInvoiceSentToCA(invoice.id))

        if (!res.success) {
            alert("Error updating status: " + res.error)
            return
        }

        const subject = `Invoice ${invoice.invoice_number} - ${invoice.clients?.company_name || "Client"}`
        const body = `Hi,\n\nPlease find attached the invoice ${invoice.invoice_number} for accounting.\n\nRegards`

        const targetEmail = caEmail || ""
        window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
            setIsLoading(true)
            const result = await deleteInvoice(invoice.id)
            setIsLoading(false)
            if (!result.success) {
                alert("Failed to delete invoice: " + result.error)
            }
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/admin/invoices/${invoice.id}`)}>
                        <FileText className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleSendToCA}>
                        <Mail className="mr-2 h-4 w-4 text-blue-500" /> Send to CA
                    </DropdownMenuItem>
                    {invoice.status !== 'Paid' && (
                        <DropdownMenuItem onClick={() => setIsPayDialogOpen(true)}>
                            <CreditCard className="mr-2 h-4 w-4" /> Mark as Paid
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Invoice
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mark Invoice as Paid</DialogTitle>
                        <DialogDescription>
                            Confirm payment details for Invoice #{invoice.invoice_number}.
                            A payment of ₹{invoice.grand_total} will be recorded.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleMarkAsPaid} disabled={isLoading}>
                            {isLoading ? "Processing..." : "Confirm Payment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
