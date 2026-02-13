"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSoftwareSubscription } from "@/actions/subscription-actions"
import { ArrowLeft, Save, RefreshCw, Wand2, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewSoftwareSubscriptionPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        software_id: "",
        software_name: "",
        customer_name: "",
        customer_email: "",
        amount_per_period: "",
        subscription_period_days: "30",
        access_password: ""
    })

    useEffect(() => {
        generateId()
        generatePassword()
    }, [])

    const generateId = () => {
        // Format: MG-SW-XXXX (random 4 alphanumeric)
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
        setFormData(prev => ({ ...prev, software_id: `MG-SW-${randomPart}` }))
    }

    const generatePassword = () => {
        // Random 8 char password
        const password = Math.random().toString(36).slice(-8)
        setFormData(prev => ({ ...prev, access_password: password }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        console.log("Form submitted with data:", formData)

        if (!formData.software_name || !formData.customer_name || !formData.amount_per_period || !formData.subscription_period_days) {
            toast.error("Please fill in all required fields")
            setLoading(false)
            return
        }

        const payload = {
            ...formData,
            amount_per_period: parseFloat(formData.amount_per_period),
            subscription_period_days: parseInt(formData.subscription_period_days)
        }

        console.log("Sending payload:", payload)

        const res = await createSoftwareSubscription(payload)

        console.log("Response:", res)

        if (res.success) {
            toast.success("Subscription created successfully!")
            router.push("/admin/subscriptions-software")
        } else {
            toast.error("Failed to create: " + res.error)
            console.error("Error details:", res.error)
        }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/subscriptions-software">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">New Subscription</h1>
                    <p className="text-muted-foreground">Create a payment link for software services.</p>
                </div>
            </div>

            <Card className="border-white/10 bg-black/20">
                <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                    <CardDescription>Enter the customer and software information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-white">Software ID</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.software_id}
                                    readOnly
                                    className="bg-white/5 font-mono text-primary border-primary/20"
                                />
                                <Button type="button" variant="outline" size="icon" onClick={generateId} title="Regenerate ID">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Unique identifier for the customer to login.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-white">Customer Name *</Label>
                                <Input
                                    placeholder="e.g. Acme Corp"
                                    value={formData.customer_name}
                                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Customer Email *</Label>
                                <Input
                                    type="email"
                                    placeholder="customer@example.com"
                                    value={formData.customer_email}
                                    onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Software Name *</Label>
                            <Input
                                placeholder="e.g. POS System v2"
                                value={formData.software_name}
                                onChange={e => setFormData({ ...formData, software_name: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-white">Amount per Period (₹) *</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount_per_period}
                                    onChange={e => setFormData({ ...formData, amount_per_period: e.target.value })}
                                    className="text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Period (Days) *</Label>
                                <Input
                                    type="number"
                                    placeholder="30"
                                    value={formData.subscription_period_days}
                                    onChange={e => setFormData({ ...formData, subscription_period_days: e.target.value })}
                                    className="text-lg"
                                />
                                <p className="text-xs text-muted-foreground">Default subscription period in days</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Access Password</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.access_password}
                                    onChange={e => setFormData({ ...formData, access_password: e.target.value })}
                                    className="font-mono bg-white/5"
                                />
                                <Button type="button" variant="outline" size="icon" onClick={generatePassword} title="Generate Password">
                                    <Wand2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Credentials needed for the customer to access the payment page.</p>
                        </div>

                        <div className="pt-6">
                            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                Create Subscription
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
