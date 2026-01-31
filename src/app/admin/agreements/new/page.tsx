"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CameraCapture } from "@/components/admin/CameraCapture"
import { AgreementSignaturePad } from "@/components/admin/AgreementSignaturePad"
import { saveAgreement, uploadFile } from "@/actions/invoice-actions"
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, User, FileText, Camera, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

const AGREEMENT_STEPS = [
    { id: 1, title: "Client Details", icon: User },
    { id: 2, title: "Verification", icon: Camera },
    { id: 3, title: "Agreement", icon: FileText },
    { id: 4, title: "Confirmation", icon: CheckCircle2 }
]

export default function NewAgreementPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<any>({
        client_name: "",
        client_company: "",
        client_email: "",
        client_phone: "",
        client_address: "",
        nominee_name: "",
        representative_name: "",
        client_photo_url: "",
        representative_photo_url: "",
        signature_url: "",
        agreement_text: `SERVICE AGREEMENT

This Agreement is made on this day between MediaGeny (the "Company") and the Client named below.

1. SCOPE OF SERVICES
The Company agrees to provide digital marketing and technical services as discussed and agreed upon in the project scope.

2. PAYMENT TERMS
Client agrees to pay the fees as specified in the individual project invoices.

3. CONFIDENTIALITY
Both parties agree to maintain strict confidentiality regarding proprietary information.

4. TERMINATION
Either party may terminate this agreement with 30 days written notice.

[SIGNATURES BELOW]`
    })

    const [files, setFiles] = useState<{ [key: string]: Blob | string }>({})

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleCapture = (field: string, blob: Blob, dataUrl: string) => {
        setFiles((prev: any) => ({ ...prev, [field]: blob }))
        setFormData((prev: any) => ({ ...prev, [`${field}_url`]: dataUrl }))
    }

    const handleSignature = (dataUrl: string) => {
        setFormData((prev: any) => ({ ...prev, signature_url: dataUrl }))
    }

    async function handleSubmit() {
        setLoading(true)
        const toastId = toast.loading("Finalizing agreement and uploading documents...")
        try {
            // Prepare data - START WITH EMPTY URLS TO PREVENT SENDING BASE64 TO SERVER
            const finalData = {
                ...formData,
                client_photo_url: "",
                representative_photo_url: "",
                signature_url: ""
            }

            // 1. Upload Photos and Signature to Storage
            const uploadTasks = []

            if (files.client_photo instanceof Blob) {
                const fd = new FormData()
                fd.append('file', files.client_photo)
                fd.append('bucket', 'service-icons')
                fd.append('path', `agreements/client-${Date.now()}.jpg`)
                uploadTasks.push(uploadFile(fd).then(res => {
                    if (res.success) finalData.client_photo_url = res.url
                    else throw new Error("Client photo upload failed: " + res.error)
                }))
            }

            if (files.representative_photo instanceof Blob) {
                const fd = new FormData()
                fd.append('file', files.representative_photo)
                fd.append('bucket', 'service-icons')
                fd.append('path', `agreements/rep-${Date.now()}.jpg`)
                uploadTasks.push(uploadFile(fd).then(res => {
                    if (res.success) finalData.representative_photo_url = res.url
                    else throw new Error("Representative photo upload failed: " + res.error)
                }))
            }

            if (formData.signature_url.startsWith('data:')) {
                const response = await fetch(formData.signature_url)
                const blob = await response.blob()
                const fd = new FormData()
                fd.append('file', blob)
                fd.append('bucket', 'service-icons')
                fd.append('path', `agreements/sig-${Date.now()}.png`)
                uploadTasks.push(uploadFile(fd).then(res => {
                    if (res.success) finalData.signature_url = res.url
                    else throw new Error("Signature upload failed: " + res.error)
                }))
            } else {
                finalData.signature_url = formData.signature_url
            }

            await Promise.all(uploadTasks)

            // 2. Save to Database
            const res = await saveAgreement(finalData)
            if (res.success && res.data?.id) {
                toast.success("Agreement onboarded successfully!", { id: toastId })
                // Use a direct redirect to be sure
                router.refresh()
                window.location.href = `/admin/agreements/${res.data.id}`
            } else {
                toast.error("Error: " + (res.error || "Failed to save agreement"), { id: toastId })
            }
        } catch (error: any) {
            console.error("Submission error:", error)
            toast.error(error.message || "An unexpected error occurred", { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-24 px-4 sm:px-6">
            <div className="flex flex-col gap-3 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Client Onboarding</h1>
                <p className="text-lg text-muted-foreground sm:text-xl">Complete the service agreement and verify identities.</p>
            </div>

            {/* Stepper */}
            <div className="flex justify-between items-center relative after:absolute after:h-[3px] after:bg-border after:top-1/2 after:-translate-y-1/2 after:left-0 after:right-0 after:-z-10 bg-muted/20 p-6 rounded-2xl shadow-sm sm:p-10">
                {AGREEMENT_STEPS.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-3 px-2">
                        <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-full flex items-center justify-center border-3 transition-all ${step >= s.id ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-xl' : 'bg-background border-border text-muted-foreground'}`}>
                            <s.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <span className={`text-xs sm:text-sm font-bold tracking-wide uppercase ${step >= s.id ? 'text-primary' : 'text-muted-foreground'}`}>{s.title}</span>
                    </div>
                ))}
            </div>

            {step === 1 && (
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Client & Representative Details</CardTitle>
                        <CardDescription>Enter basic information for the agreement.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8 md:grid-cols-2 p-8">
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Client Name *</Label>
                            <Input className="h-14 text-lg" value={formData.client_name} onChange={e => setFormData({ ...formData, client_name: e.target.value })} placeholder="Full Name" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Client Company</Label>
                            <Input className="h-14 text-lg" value={formData.client_company} onChange={e => setFormData({ ...formData, client_company: e.target.value })} placeholder="Company Name (Optional)" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Email</Label>
                            <Input className="h-14 text-lg" type="email" value={formData.client_email} onChange={e => setFormData({ ...formData, client_email: e.target.value })} />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Phone</Label>
                            <Input className="h-14 text-lg" value={formData.client_phone} onChange={e => setFormData({ ...formData, client_phone: e.target.value })} />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                            <Label className="text-base font-semibold">Address</Label>
                            <Textarea className="min-h-[120px] text-lg p-4" value={formData.client_address} onChange={e => setFormData({ ...formData, client_address: e.target.value })} />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Nominee Name</Label>
                            <Input className="h-14 text-lg" value={formData.nominee_name} onChange={e => setFormData({ ...formData, nominee_name: e.target.value })} />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Registering Representative Name *</Label>
                            <Input className="h-14 text-lg" value={formData.representative_name} onChange={e => setFormData({ ...formData, representative_name: e.target.value })} placeholder="Your Name" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle>Client Photo *</CardTitle>
                            <CardDescription>Live photo of the client is mandatory.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CameraCapture label="Client" onCapture={(blob, url) => handleCapture("client_photo", blob, url)} />
                        </CardContent>
                    </Card>
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle>Representative Photo *</CardTitle>
                            <CardDescription>Live photo of the registering rep is mandatory.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CameraCapture label="Representative" onCapture={(blob, url) => handleCapture("representative_photo", blob, url)} />
                        </CardContent>
                    </Card>
                </div>
            )}

            {step === 3 && (
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Service Agreement</CardTitle>
                        <CardDescription>Read the terms and sign below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Agreement Content (You can edit this)</Label>
                            <Textarea
                                value={formData.agreement_text}
                                onChange={e => setFormData({ ...formData, agreement_text: e.target.value })}
                                className="bg-muted/50 p-6 rounded-lg border text-sm whitespace-pre-wrap font-serif min-h-[300px]"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-lg font-bold">Authorized Client Signature</Label>
                            <AgreementSignaturePad onSave={handleSignature} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 4 && (
                <Card className="border-primary/20 bg-primary/5 text-center py-12">
                    <CardContent className="space-y-6">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <ShieldCheck className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Ready to Board</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                All details, photos and signature have been captured. Click the button below to finalize the onboarding.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-between items-center bg-muted/10 p-4 rounded-2xl border-2 border-dashed">
                <Button variant="ghost" size="lg" className="h-16 px-8 text-lg" onClick={handleBack} disabled={step === 1 || loading}>
                    <ArrowLeft className="mr-3 h-6 w-6" /> Back
                </Button>

                {step < 4 ? (
                    <Button
                        size="lg"
                        className="h-16 px-10 text-lg shadow-lg shadow-primary/20"
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !formData.client_name) ||
                            (step === 2 && (!formData.client_photo_url || !formData.representative_photo_url)) ||
                            (step === 3 && !formData.signature_url)
                        }
                    >
                        Next Step <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                ) : (
                    <Button size="lg" className="h-16 px-10 text-lg shadow-lg shadow-primary/20" onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <CheckCircle2 className="mr-3 h-6 w-6" />}
                        Finalize & Board Agreement
                    </Button>
                )}
            </div>
        </div>
    )
}
