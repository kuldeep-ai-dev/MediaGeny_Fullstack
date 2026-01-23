
"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export function DownloadPDFButton({ targetId, fileName }: { targetId: string, fileName: string }) {
    const [isGenerating, setIsGenerating] = useState(false)

    const downloadPDF = async () => {
        const element = document.getElementById(targetId)
        if (!element) return

        setIsGenerating(true)
        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // For images from Supabase
                logging: false
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4" // Standard A4 format
            })

            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
            pdf.save(fileName)
        } catch (error) {
            console.error("PDF Generation failed", error)
            alert("Failed to generate PDF. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button onClick={downloadPDF} disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
    )
}
