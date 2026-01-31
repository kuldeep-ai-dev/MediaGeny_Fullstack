"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Printer, ShieldCheck, Edit, Save, X } from "lucide-react"
import { saveAgreement } from "@/actions/invoice-actions"
import { toast } from "sonner"
import { DownloadPDFButton } from "@/components/invoice/DownloadPDFButton"

export function AgreementView({ agreement: initialAgreement, profile }: { agreement: any, profile: any }) {
    const [isEditing, setIsEditing] = useState(false)
    const [agreement, setAgreement] = useState(initialAgreement)
    const [editedText, setEditedText] = useState(initialAgreement.agreement_text)
    const [isSaving, setIsSaving] = useState(false)

    async function handleSave() {
        setIsSaving(true)
        try {
            const res = await saveAgreement({
                ...agreement,
                agreement_text: editedText
            })
            if (res.success) {
                setAgreement(res.data)
                setIsEditing(false)
                toast.success("Agreement updated successfully")
            } else {
                toast.error("Error: " + res.error)
            }
        } catch (error: any) {
            toast.error("Failed to save changes")
        }
        setIsSaving(false)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between no-print gap-6 bg-muted/20 p-6 rounded-2xl border shadow-sm">
                <div className="flex gap-4 w-full sm:w-auto">
                    <DownloadPDFButton targetId="printable-agreement" fileName={`Agreement-${agreement.client_name.replace(/\s+/g, '-')}.pdf`} />
                    <Button onClick={() => window.print()} variant="outline" size="lg" className="h-14 px-6 flex-1 sm:flex-none">
                        <Printer className="mr-3 h-5 w-5" /> Print
                    </Button>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    {isEditing ? (
                        <>
                            <Button variant="ghost" size="lg" className="h-14 px-6 flex-1 sm:flex-none" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                <X className="mr-3 h-5 w-5" /> Cancel
                            </Button>
                            <Button size="lg" className="h-14 px-8 flex-1 sm:flex-none shadow-lg shadow-primary/20" onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-3 h-5 w-5" /> Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button variant="secondary" size="lg" className="h-14 px-8 flex-1 sm:flex-none" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-3 h-5 w-5" /> Edit Terms
                        </Button>
                    )}
                </div>
            </div>

            <Card className="border-none shadow-2xl bg-white text-black p-0 print:shadow-none print:m-0 overflow-hidden rounded-3xl">
                <CardContent className="p-8 sm:p-16 space-y-16 agreement-canvas transition-all" id="printable-agreement">
                    {/* Header: Logo and Business Info */}
                    <div className="flex justify-between items-start border-b pb-8">
                        <div>
                            {profile?.logo_url ? (
                                <img src={profile.logo_url} alt="Logo" className="h-16 w-auto mb-4" />
                            ) : (
                                <h2 className="text-3xl font-bold text-primary">{profile?.agency_name || "MediaGeny"}</h2>
                            )}
                            <p className="text-sm text-gray-600 max-w-xs">{profile?.address}</p>
                            <p className="text-sm text-gray-600">{profile?.email} | {profile?.phone}</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-400">Service Agreement</h1>
                            <p className="text-sm text-gray-500 font-mono mt-2">ID: {agreement.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500">Date: {new Date(agreement.agreement_date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Client Information Section */}
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="font-bold uppercase text-xs tracking-wider text-gray-500 border-b pb-1">Client Details</h3>
                            <div className="space-y-1">
                                <p className="font-bold text-lg">{agreement.client_name}</p>
                                <p className="text-gray-700">{agreement.client_company}</p>
                                <p className="text-gray-700">{agreement.client_address}</p>
                                <p className="text-gray-700">{agreement.client_email}</p>
                                <p className="text-gray-700">{agreement.client_phone}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold uppercase text-xs tracking-wider text-gray-500 border-b pb-1">Verification Data</h3>
                            <div className="flex gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase">Client Photo</p>
                                    <div className="h-24 w-32 border bg-gray-50 rounded overflow-hidden">
                                        <img src={agreement.client_photo_url} alt="Client" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase">Rep Photo</p>
                                    <div className="h-24 w-32 border bg-gray-50 rounded overflow-hidden">
                                        <img src={agreement.representative_photo_url} alt="Rep" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 italic">Representative: {agreement.representative_name}</p>
                                {agreement.nominee_name && <p className="text-xs text-gray-600 italic">Nominee: {agreement.nominee_name}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Agreement Text Area */}
                    <div className="space-y-6">
                        <h3 className="font-extrabold uppercase text-sm tracking-widest text-gray-500 border-b-2 pb-2">Agreement Terms</h3>
                        {isEditing ? (
                            <Textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                className="min-h-[600px] font-serif text-lg leading-relaxed p-6 rounded-2xl border-2 shadow-inner"
                            />
                        ) : (
                            <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-serif min-h-[400px] bg-gray-50/30 p-8 rounded-2xl">
                                {agreement.agreement_text}
                            </div>
                        )}
                    </div>

                    {/* Signatures Section */}
                    <div className="grid grid-cols-2 gap-24 pt-12 border-t">
                        <div className="space-y-4 flex flex-col items-center border-r pr-12">
                            <div className="h-20 w-48 flex items-end justify-center">
                                <img src={agreement.signature_url} alt="Client Signature" className="max-h-full max-w-full" />
                            </div>
                            <div className="w-full border-t border-black text-center pt-2">
                                <p className="text-sm font-bold">{agreement.client_name}</p>
                                <p className="text-[10px] uppercase text-gray-500">Authorized Client Signature</p>
                            </div>
                        </div>
                        <div className="space-y-4 flex flex-col items-center">
                            <div className="h-20 w-48 flex items-end justify-center">
                                {profile?.signature_url && (
                                    <img src={profile.signature_url} alt="Agency Signature" className="max-h-full max-w-full" />
                                )}
                            </div>
                            <div className="w-full border-t border-black text-center pt-2">
                                <p className="text-sm font-bold uppercase">{profile?.agency_name || "MediaGeny"}</p>
                                <p className="text-[10px] uppercase text-gray-500">Authorized Company Signature</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-center items-center gap-2 pt-8 text-gray-400">
                        <ShieldCheck className="h-4 w-4" />
                        <p className="text-[10px] uppercase tracking-widest">Digitally Signed & Verified via MediaGeny Onboarding System</p>
                    </div>
                </CardContent>
            </Card>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0; padding: 0; }
                    .agreement-canvas { 
                        box-shadow: none !important; 
                        border: none !important; 
                        width: 210mm;
                        padding: 15mm !important;
                        margin: 0 auto;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}} />
        </div>
    )
}
