"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ServiceContactFormProps {
    serviceTitle: string
}

import { useState } from "react"
import { submitAppointment } from "@/actions/appointment-actions"
import { Loader2, CheckCircle2 } from "lucide-react"

export function ServiceContactForm({ serviceTitle }: ServiceContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)

        const result = await submitAppointment({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            service_type: serviceTitle,
            message: `Budget: ${formData.get("budget") || "Not specified"}\n\nRequirements: ${formData.get("requirements") || ""}`,
            inquiry_source: "Service Quote Form",
            inquiry_type: "Quote Request",
        })

        if (result.success) {
            setIsSuccess(true)
        } else {
            alert("Error submitting request: " + result.error)
        }
        setIsSubmitting(false)
    }

    if (isSuccess) {
        return (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 backdrop-blur-sm text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Quote Request Sent!</h3>
                <p className="text-muted-foreground">
                    Thank you for your interest in {serviceTitle}. We will review your requirements and get back to you shortly.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setIsSuccess(false)}>
                    Send Another
                </Button>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-2xl font-bold">Get a Quote for {serviceTitle}</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Name
                        </label>
                        <Input id="name" name="name" required placeholder="John Doe" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email
                        </label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-background/50" />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Phone (Optional)
                        </label>
                        <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Budget Range
                        </label>
                        <Input id="budget" name="budget" placeholder="$5k - $10k" className="bg-background/50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="requirements" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Project Requirements
                    </label>
                    <Textarea
                        id="requirements"
                        name="requirements"
                        placeholder={`Tell us about your ${serviceTitle.toLowerCase()} needs...`}
                        className="min-h-[120px] bg-background/50"
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-12 text-lg">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>Send Inquiry <Send className="ml-2 h-4 w-4" /></>}
                </Button>
            </form>
        </div>
    )
}
