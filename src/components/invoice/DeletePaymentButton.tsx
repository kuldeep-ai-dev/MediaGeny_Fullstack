
"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deletePayment } from "@/actions/invoice-actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeletePaymentButton({ paymentId }: { paymentId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter() // Though deletePayment revalidates, specific routing logic might be needed if simple revalidate fails

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this payment record? This will NOT revert the invoice status.")) {
            setIsLoading(true)
            await deletePayment(paymentId)
            setIsLoading(false)
        }
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
    )
}
