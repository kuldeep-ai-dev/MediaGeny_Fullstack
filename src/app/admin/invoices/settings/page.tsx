
"use client"

import { useEffect, useState } from "react"
import { getBusinessProfile, saveBusinessProfile, uploadFile } from "@/actions/invoice-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabaseClient } from "@/lib/supabase-client"

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function BusinessSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<any>({
        agency_name: "",
        company_name: "",
        gst_number: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        upi_id: "",
        default_gst_rate: "18",
        owner_state: "Delhi", // Default
    })
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [signatureFile, setSignatureFile] = useState<File | null>(null)

    useEffect(() => {
        loadProfile()
    }, [])

    async function loadProfile() {
        const res = await getBusinessProfile()
        if (res.success && res.data) {
            setProfile(res.data)
        }
        setLoading(false)
    }

    async function handleUpload(file: File, pathPrefix: string) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${pathPrefix}-${Date.now()}.${fileExt}`

        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', 'service-icons')
        formData.append('path', fileName)

        const res = await uploadFile(formData)
        if (!res.success) throw new Error(res.error)
        return res.url
    }

    async function handleSave() {
        setSaving(true)
        try {
            const updates = { ...profile }

            if (logoFile) {
                updates.logo_url = await handleUpload(logoFile, 'logo')
            }
            if (signatureFile) {
                updates.signature_url = await handleUpload(signatureFile, 'signature')
            }

            const res = await saveBusinessProfile(updates)
            if (res.success) {
                setProfile(res.data)
                alert("Settings saved successfully!")
                // Reset file inputs if needed, or keep them to show what was just uploaded conceptually (though browser input clears)
                setLogoFile(null)
                setSignatureFile(null)
            } else {
                alert("Error saving settings: " + res.error)
            }
        } catch (error: any) {
            alert("Error: " + error.message)
        }
        setSaving(false)
    }

    if (loading) return <div className="p-10"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Business Profile</h1>
                <p className="text-muted-foreground mt-2">Configure your agency details for invoices.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>This information will appear on the top of your invoices.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Agency Name *</Label>
                        <Input
                            value={profile.agency_name}
                            onChange={(e) => setProfile({ ...profile, agency_name: e.target.value })}
                            placeholder="e.g. MediaGeny"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Legal Company Name</Label>
                        <Input
                            value={profile.company_name}
                            onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                            placeholder="e.g. MediaGeny Pvt Ltd"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>CA Email (For Auto-Send)</Label>
                        <Input
                            value={profile.ca_email || ""}
                            onChange={(e) => setProfile({ ...profile, ca_email: e.target.value })}
                            placeholder="choudhurykuldeep27@gmail.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Business Address</Label>
                        <Textarea
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            placeholder="Full address with pin code"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Website</Label>
                        <Input
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tax & Financials</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>GST Number</Label>
                        <Input
                            value={profile.gst_number}
                            onChange={(e) => setProfile({ ...profile, gst_number: e.target.value })}
                            placeholder="e.g. 22AAAAA0000A1Z5"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>State (Required for GST Logic) *</Label>
                        <Select
                            value={profile.owner_state}
                            onValueChange={(val) => setProfile({ ...profile, owner_state: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                                {INDIAN_STATES.map(state => (
                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Default GST Rate (%)</Label>
                        <Select
                            value={String(profile.default_gst_rate)}
                            onValueChange={(val) => setProfile({ ...profile, default_gst_rate: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">0%</SelectItem>
                                <SelectItem value="5">5%</SelectItem>
                                <SelectItem value="12">12%</SelectItem>
                                <SelectItem value="18">18%</SelectItem>
                                <SelectItem value="28">28%</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                            value={profile.bank_name}
                            onChange={(e) => setProfile({ ...profile, bank_name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Account Number</Label>
                        <Input
                            value={profile.account_number}
                            onChange={(e) => setProfile({ ...profile, account_number: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>IFSC Code</Label>
                        <Input
                            value={profile.ifsc_code}
                            onChange={(e) => setProfile({ ...profile, ifsc_code: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>UPI ID</Label>
                        <Input
                            value={profile.upi_id}
                            onChange={(e) => setProfile({ ...profile, upi_id: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Branding</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <div className="flex gap-4 items-center">
                            {profile.logo_url && <img src={profile.logo_url} alt="Logo" className="h-12 w-auto object-contain border p-1 rounded" />}
                            <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Digital Signature (Optional)</Label>
                        <div className="flex gap-4 items-center">
                            {profile.signature_url && <img src={profile.signature_url} alt="Sig" className="h-12 w-auto object-contain border p-1 rounded" />}
                            <Input type="file" accept="image/*" onChange={(e) => setSignatureFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button size="lg" onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Settings
                </Button>
            </div>
        </div>
    )
}
