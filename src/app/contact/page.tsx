"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar, Loader2, CheckCircle2, MapPin, Phone, Mail, Clock } from "lucide-react"
import { submitAppointment } from "@/actions/appointment-actions"
import { getCompanyProfile, CompanyProfile } from "@/actions/about-actions"
import { getServices } from "@/actions/public-actions"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [profile, setProfile] = useState<CompanyProfile | null>(null)
    const [services, setServices] = useState<any[]>([])

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        const [profileData, servicesRes] = await Promise.all([
            getCompanyProfile(),
            getServices()
        ])
        setProfile(profileData)
        if (servicesRes.success) {
            setServices(servicesRes.services || [])
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)

        const result = await submitAppointment({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            service_type: formData.get("service_type") as string,
            preferred_date: formData.get("preferred_date") as string,
            message: formData.get("message") as string,
            inquiry_source: "Contact Page",
            inquiry_type: "Appointment",
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
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background px-4">
                <Card className="max-w-md w-full border-green-500/20 bg-green-500/5 text-center p-8">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Request Received!</h2>
                    <p className="text-muted-foreground">
                        Thank you for booking an appointment. Our team will contact you shortly to confirm the details.
                    </p>
                    <Button className="mt-6" variant="outline" onClick={() => window.location.href = "/"}>
                        Back to Home
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                        Book an Appointment
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ready to start your digital transformation? Schedule a consultation with our experts.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Sidebar */}
                    <div className="space-y-8">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>Reach out to us directly or visit our office.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-white">Office Location</h3>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            {profile?.address || "Loading address..."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-white">Phone Number</h3>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            {profile?.phone || "Loading phone..."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-white">Email Address</h3>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            {profile?.email || "Loading email..."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-white">Business Hours</h3>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Mon - Fri: 9:00 AM - 6:00 PM<br />
                                            Sat - Sun: Closed
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>Appointment Details</CardTitle>
                                <CardDescription>Tell us a bit about what you need.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" name="name" required placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" name="phone" placeholder="+91 98765 43210" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="service">Service Interest</Label>
                                            <Select name="service_type" required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {services.length > 0 ? (
                                                        services.map((service) => (
                                                            <SelectItem key={service.slug || service.title} value={service.title}>
                                                                {service.title}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <SelectItem value="Web Development">Web Development</SelectItem>
                                                            <SelectItem value="App Development">App Development</SelectItem>
                                                            <SelectItem value="Cloud Solutions">Cloud Solutions</SelectItem>
                                                            <SelectItem value="Consultation">General Consultation</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date">Preferred Date</Label>
                                        <Input id="date" name="preferred_date" type="date" required className="block w-full" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message (Optional)</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us more about your project goals..."
                                            className="min-h-[150px]"
                                        />
                                    </div>

                                    <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-secondary font-bold h-12 text-lg">
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Book Appointment"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
