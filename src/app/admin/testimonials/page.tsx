"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, Trash2, Eye, EyeOff, Star, Copy } from "lucide-react"
import { getAllTestimonials, toggleTestimonialVisibility, deleteTestimonial, Testimonial } from "@/actions/testimonial-actions"

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setIsLoading(true)
        const data = await getAllTestimonials()
        setTestimonials(data)
        setIsLoading(false)
    }

    async function handleToggle(id: string, currentState: boolean) {
        await toggleTestimonialVisibility(id, currentState)
        loadData()
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this review?")) return
        await deleteTestimonial(id)
        loadData()
    }

    function copyLink() {
        const link = `${window.location.origin}/rate-us`
        navigator.clipboard.writeText(link)
        alert("Link copied to clipboard: " + link)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
                    <p className="text-muted-foreground">Manage client reviews and collect new ones.</p>
                </div>
                <Button onClick={copyLink} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Copy className="mr-2 h-4 w-4" /> Copy Collection Link
                </Button>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>All Reviews</CardTitle>
                    <CardDescription>{testimonials.length} reviews received.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                            <p className="text-muted-foreground mb-4">No reviews yet.</p>
                            <Button variant="outline" onClick={copyLink}>
                                <Link2 className="mr-2 h-4 w-4" /> Share Link with Clients
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {testimonials.map((t) => (
                                <div key={t.id} className="group relative p-6 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {t.image_url ? (
                                                    <img src={t.image_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                                                        {t.client_name[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold leading-none">{t.client_name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{t.client_role}</p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {Array.from({ length: t.rating }).map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground italic">"{t.content}"</p>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-white/10 flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant={t.is_featured ? "secondary" : "outline"}
                                            onClick={() => handleToggle(t.id, t.is_featured)}
                                            className={t.is_featured ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "text-muted-foreground"}
                                        >
                                            {t.is_featured ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                            {t.is_featured ? "Visible" : "Hidden"}
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(t.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
