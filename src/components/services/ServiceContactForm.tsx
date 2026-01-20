"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ServiceContactFormProps {
    serviceTitle: string
}

export function ServiceContactForm({ serviceTitle }: ServiceContactFormProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-2xl font-bold">Get a Quote for {serviceTitle}</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Name
                        </label>
                        <Input id="name" placeholder="John Doe" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email
                        </label>
                        <Input id="email" type="email" placeholder="john@example.com" className="bg-background/50" />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Phone (Optional)
                        </label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Budget Range
                        </label>
                        <Input id="budget" placeholder="$5k - $10k" className="bg-background/50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="requirements" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Project Requirements
                    </label>
                    <Textarea
                        id="requirements"
                        placeholder={`Tell us about your ${serviceTitle.toLowerCase()} needs...`}
                        className="min-h-[120px] bg-background/50"
                    />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-12 text-lg">
                    Send Inquiry <Send className="ml-2 h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}
