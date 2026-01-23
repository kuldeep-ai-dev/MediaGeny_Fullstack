"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Star, Loader2, CheckCircle2 } from "lucide-react"
import { submitTestimonial } from "@/actions/testimonial-actions"
import { cn } from "@/lib/utils"

export default function RateUsPage() {
    const [rating, setRating] = useState(5)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)

        const result = await submitTestimonial({
            client_name: formData.get("name") as string,
            client_role: formData.get("role") as string,
            content: formData.get("content") as string,
            image_url: formData.get("image_url") as string,
            rating: rating
        })

        if (result.success) {
            setIsSuccess(true)
        } else {
            alert("Error submitting review: " + result.error)
        }
        setIsSubmitting(false)
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="max-w-md w-full border-green-500/20 bg-green-500/5 text-center p-8">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                    <p className="text-muted-foreground">
                        Your feedback has been submitted successfully. We appreciate your support!
                    </p>
                    <Button className="mt-6" variant="outline" onClick={() => window.location.href = "/"}>
                        Back to Home
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px]" />

            <div className="z-10 w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Rate Your Experience
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        How was your experience working with MediaGeny?
                    </p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                        <CardDescription>Your feedback helps us improve and grow.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Rating</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={cn(
                                                    "h-8 w-8 transition-colors",
                                                    star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Your Name</Label>
                                    <Input id="name" name="name" required placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role / Company (Optional)</Label>
                                    <Input id="role" name="role" placeholder="CEO, TechCorp" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">Profile Photo URL (Optional)</Label>
                                <Input id="image_url" name="image_url" placeholder="https://linkedin.com/..." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Your Review</Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    required
                                    placeholder="Tell us what you liked..."
                                    className="min-h-[120px]"
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-secondary font-bold">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Review"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
