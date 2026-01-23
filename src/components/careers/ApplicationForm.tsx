"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitApplication, Job } from "@/actions/career-actions"
import { Loader2, Upload } from "lucide-react"

interface ApplicationFormProps {
    job?: Job // Job is now optional
}

export function ApplicationForm({ job }: ApplicationFormProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        if (job) {
            formData.append("job_id", job.id)
        }
        // If no job, job_id remains null/undefined which maps to Talent Pool

        const result = await submitApplication(formData)

        if (result.success) {
            setSubmitted(true)
            setTimeout(() => {
                setOpen(false)
                setSubmitted(false)
            }, 3000)
        } else {
            alert("Failed to submit application: " + result.error)
        }
        setIsLoading(false)
    }

    const title = job ? `Apply for ${job.title}` : "Join our Talent Pool"
    const subtitle = job ? `${job.department} • ${job.location}` : "Submit your resume for future opportunities."
    const buttonText = job ? "Apply Now" : "Join Talent Pool"

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={job ? "bg-gradient-to-r from-primary to-secondary" : "w-full border-primary text-primary hover:bg-primary/10"} variant={job ? "default" : "outline"}>
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {subtitle}
                    </DialogDescription>
                </DialogHeader>

                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-2xl">✓</div>
                        <div>
                            <h3 className="text-lg font-semibold">Application Received!</h3>
                            <p className="text-muted-foreground text-sm">
                                {job ? "We'll review your application and get back to you." : "You've been added to our talent pool. We'll contact you if a fit arises."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="candidate_name">Full Name</Label>
                                <Input id="candidate_name" name="candidate_name" required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" required placeholder="+1 234 567 890" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resume_url">Resume Link (LinkedIn / Portfolio / Drive)</Label>
                            <Input id="resume_url" name="resume_url" required placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cover_letter">Cover Letter (Optional)</Label>
                            <Textarea
                                id="cover_letter"
                                name="cover_letter"
                                placeholder={job ? "Tell us why you're a great fit..." : "Tell us what kind of roles you are interested in..."}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="pt-4">
                            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {job ? "Submit Application" : "Join Talent Pool"}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
