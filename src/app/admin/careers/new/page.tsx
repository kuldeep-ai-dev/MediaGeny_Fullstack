"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { createJob } from "@/actions/career-actions"

export default function NewJobPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [requirements, setRequirements] = useState<string[]>([])
    const [newReq, setNewReq] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)

        const jobData = {
            title: formData.get("title") as string,
            type: formData.get("type") as "job" | "internship",
            department: formData.get("department") as string,
            location: formData.get("location") as string,
            description: formData.get("description") as string,
            requirements: requirements,
            is_active: true
        }

        const result = await createJob(jobData)

        if (result.success) {
            router.push("/admin/careers")
        } else {
            alert("Failed to create job: " + result.error)
        }
        setIsLoading(false)
    }

    const addRequirement = () => {
        if (!newReq.trim()) return
        setRequirements([...requirements, newReq.trim()])
        setNewReq("")
    }

    const removeRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/careers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Post New Opening</h2>
                    <p className="text-muted-foreground">Create a new job opportunity or internship.</p>
                </div>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Fill in the details for the new position.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input id="title" name="title" placeholder="e.g. Senior React Developer" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select name="type" defaultValue="job" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="job">Full-time Job</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" name="department" placeholder="e.g. Engineering" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" defaultValue="Remote" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Detailed job description..."
                                className="min-h-[150px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Requirements</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newReq}
                                    onChange={(e) => setNewReq(e.target.value)}
                                    placeholder="Add a requirement..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            addRequirement()
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addRequirement} variant="secondary">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                                        <span>{req}</span>
                                        <button type="button" onClick={() => removeRequirement(i)} className="text-muted-foreground hover:text-red-400">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/admin/careers">
                                <Button variant="ghost" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit" className="bg-gradient-to-r from-primary to-secondary" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Post Job
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
