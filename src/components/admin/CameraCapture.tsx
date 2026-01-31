"use client"

import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, CameraOff } from "lucide-react"

interface CameraCaptureProps {
    onCapture: (blob: Blob, dataUrl: string) => void
    label: string
}

export function CameraCapture({ onCapture, label }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isStarted, setIsStarted] = useState(false)
    const [photo, setPhoto] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [stream])

    async function startCamera() {
        setError(null)
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setIsStarted(true)
            setPhoto(null)
        } catch (err: any) {
            console.error("Camera access error:", err)
            setError("Could not access camera. Please ensure permissions are granted.")
        }
    }

    function capturePhoto() {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        if (!context) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL("image/jpeg")
        setPhoto(dataUrl)

        canvas.toBlob((blob) => {
            if (blob) onCapture(blob, dataUrl)
        }, "image/jpeg", 0.9)

        // Stop camera stream after capture to save resources
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }

    function retake() {
        setPhoto(null)
        startCamera()
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-video rounded-3xl bg-black overflow-hidden border-4 border-muted shadow-2xl">
                {!isStarted && !photo && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-white/50 bg-muted/10">
                        <Camera className="h-20 w-20 opacity-50" />
                        <Button variant="secondary" size="lg" className="h-16 px-10 text-xl font-bold rounded-2xl shadow-lg" onClick={startCamera}>
                            Start Camera for {label}
                        </Button>
                    </div>
                )}

                {isStarted && !photo && (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover mirror"
                        />
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                            <Button size="icon" className="h-24 w-24 rounded-full border-8 border-white/30 bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all active:scale-95" onClick={capturePhoto}>
                                <div className="h-16 w-16 rounded-full bg-white border-2 border-primary/20" />
                            </Button>
                        </div>
                    </>
                )}

                {photo && (
                    <div className="relative h-full w-full">
                        <img src={photo} alt="Captured" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center bg-destructive/10">
                        <CameraOff className="h-16 w-16 text-destructive" />
                        <p className="text-xl text-destructive font-bold">{error}</p>
                        <Button variant="outline" size="lg" className="h-14 font-bold" onClick={startCamera}>Try Again</Button>
                    </div>
                )}
            </div>

            {photo && (
                <div className="flex justify-center gap-4">
                    <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-xl" onClick={retake}>
                        <RefreshCw className="mr-3 h-5 w-5" /> Retake Photo
                    </Button>
                </div>
            )}

            <style jsx>{`
                .mirror {
                    transform: scaleX(-1);
                }
            `}</style>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}
