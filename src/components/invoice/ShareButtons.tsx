"use client"

import { Button } from "@/components/ui/button"
import { Printer, Share2, Mail, MessageCircle } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ShareButtonsProps {
    invoiceNumber: string
    clientName: string
    amount: string
}

export function ShareButtons({ invoiceNumber, clientName, amount }: ShareButtonsProps) {

    const handlePrint = () => {
        window.print()
    }

    const handleWhatsApp = () => {
        const text = `Hello ${clientName}, here is your invoice ${invoiceNumber} for ${amount}. Please pay at your earliest convenience.`
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    const handleEmail = () => {
        const subject = `Invoice ${invoiceNumber} from MediaGeny`
        const body = `Hello ${clientName},%0D%0A%0D%0APlease find attached the invoice ${invoiceNumber} for ${amount}.%0D%0A%0D%0AThank you,%0D%0AMediaGeny`
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self')
    }

    return (
        <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleWhatsApp} className="cursor-pointer">
                        <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                        WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEmail} className="cursor-pointer">
                        <Mail className="mr-2 h-4 w-4 text-blue-500" />
                        Email
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
