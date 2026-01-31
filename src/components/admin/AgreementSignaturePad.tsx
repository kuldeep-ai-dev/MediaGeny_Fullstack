"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Check } from "lucide-react"
import { toast } from "sonner"

interface AgreementSignaturePadProps {
    onSave: (dataUrl: string) => void
    onClear?: () => void
}

export function AgreementSignaturePad({ onSave, onClear }: AgreementSignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set high resolution for canvas
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * 2
        canvas.height = rect.height * 2
        ctx.scale(2, 2)

        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
    }, [])

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true)
        setIsEmpty(false)
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const pos = getPos(e)
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const pos = getPos(e)
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()

        let clientX, clientY
        if ("touches" in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = (e as React.MouseEvent).clientX
            clientY = (e as React.MouseEvent).clientY
        }

        return {
            x: (clientX - rect.left),
            y: (clientY - rect.top)
        }
    }

    const clear = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setIsEmpty(true)
        if (onClear) onClear()
    }

    const save = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const dataUrl = canvas.toDataURL("image/png")
        onSave(dataUrl)
        toast.success("Signature saved!")
    }

    return (
        <div className="space-y-6">
            <div className="border-4 border-muted rounded-2xl bg-white overflow-hidden touch-none shadow-2xl relative">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-[400px] cursor-crosshair sm:h-[500px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
                />
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <p className="text-4xl font-bold uppercase tracking-widest text-muted-foreground select-none">Sign Here</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20 p-4 rounded-2xl border">
                <p className="text-sm font-medium text-muted-foreground">
                    {isEmpty ? "Please sign with your Apple Pencil or finger." : "Signature Capture Successful"}
                </p>
                <div className="flex gap-4 w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="flex-1 sm:flex-none h-14" onClick={clear} disabled={isEmpty}>
                        <Eraser className="mr-2 h-5 w-5" /> Clear
                    </Button>
                    <Button size="lg" className="flex-1 sm:flex-none h-14 shadow-lg shadow-primary/20" onClick={save} disabled={isEmpty}>
                        <Check className="mr-2 h-5 w-5" /> Confirm
                    </Button>
                </div>
            </div>
        </div>
    )
}
