"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, Search, Globe, Code, Share2, Shield } from "lucide-react"
import { getPageSeo, updatePageSeo, PageSeoData } from "@/actions/seo-actions"

const STATIC_PAGES = [
    { key: "home", label: "Home Page" },
    { key: "about", label: "About Us" },
    { key: "contact", label: "Contact Us" },
    { key: "services", label: "Services Landing" },
    { key: "products", label: "Products Landing" },
    { key: "careers", label: "Careers Page" },
    { key: "blogs", label: "Blogs Landing" },
]

export function SeoManager() {
    const [selectedPage, setSelectedPage] = useState("home")
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<PageSeoData>>({
        title: "",
        description: "",
        keywords: "",
        og_title: "",
        og_description: "",
        canonical_url: "",
        robots_meta: "index, follow",
        schema_markup: "{}",
        geo_location: ""
    })

    useEffect(() => {
        fetchSeoData(selectedPage)
    }, [selectedPage])

    async function fetchSeoData(key: string) {
        setLoading(true)
        const res = await getPageSeo(key)
        if (res.success && res.data) {
            setFormData({
                ...res.data,
                schema_markup: JSON.stringify(res.data.schema_markup || {}, null, 2),
                robots_meta: res.data.robots_meta || "index, follow"
            })
        } else {
            // Reset if no data found
            setFormData({
                title: "",
                description: "",
                keywords: "",
                og_title: "",
                og_description: "",
                canonical_url: "",
                robots_meta: "index, follow",
                schema_markup: "{}",
                geo_location: ""
            })
        }
        setLoading(false)
    }

    async function handleSave() {
        setSaving(true)
        try {
            // Validate JSON
            let parsedSchema = {}
            try {
                parsedSchema = JSON.parse(formData.schema_markup as string || "{}")
            } catch (e) {
                alert("Invalid JSON in Schema Markup")
                setSaving(false)
                return
            }

            const res = await updatePageSeo({
                page_key: selectedPage,
                title: formData.title || null,
                description: formData.description || null,
                keywords: formData.keywords || null,
                og_title: formData.og_title || null,
                og_description: formData.og_description || null,
                og_image: null, // TODO: Add upload
                canonical_url: formData.canonical_url || null,
                robots_meta: formData.robots_meta || "index, follow",
                schema_markup: parsedSchema,
                geo_location: formData.geo_location || null
            })

            if (res.success) {
                alert("SEO settings updated!")
            } else {
                alert("Failed to update: " + res.error)
            }
        } catch (error) {
            alert("Something went wrong")
        }
        setSaving(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">SEO Manager</h2>
                    <p className="text-muted-foreground">Top-notch optimization for search engines & social.</p>
                </div>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATIC_PAGES.map(page => (
                            <SelectItem key={page.key} value={page.key}>{page.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Meta Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-primary" />
                                Search Engine Listing
                            </CardTitle>
                            <CardDescription>
                                How your page appears in Google search results.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Meta Title</Label>
                                <Input
                                    value={formData.title || ""}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Best Digital Agency in 2024 | MediaGeny"
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {(formData.title?.length || 0)}/60
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Description</Label>
                                <Textarea
                                    value={formData.description || ""}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief summary used by Google..."
                                    className="h-24"
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {(formData.description?.length || 0)}/160
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Keywords</Label>
                                <Input
                                    value={formData.keywords || ""}
                                    onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                    placeholder="e.g., web development, seo, app design"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social / Open Graph */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="h-5 w-5 text-blue-500" />
                                Social Media Sharing
                            </CardTitle>
                            <CardDescription>
                                Optimize how links look on Facebook, LinkedIn, Twitter.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>OG Title (Social Title)</Label>
                                <Input
                                    value={formData.og_title || formData.title || ""}
                                    onChange={e => setFormData({ ...formData, og_title: e.target.value })}
                                    placeholder="Often same as Meta Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>OG Description</Label>
                                <Textarea
                                    value={formData.og_description || formData.description || ""}
                                    onChange={e => setFormData({ ...formData, og_description: e.target.value })}
                                    placeholder="Engaging summary for social clicks..."
                                    className="h-24"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advanced Technical SEO */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-500" />
                                Technical SEO
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Canonical URL</Label>
                                <Input
                                    value={formData.canonical_url || ""}
                                    onChange={e => setFormData({ ...formData, canonical_url: e.target.value })}
                                    placeholder="https://mediageny.com/your-page"
                                />
                                <p className="text-xs text-muted-foreground">Original source of this content.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Robots Meta</Label>
                                <Select
                                    value={formData.robots_meta || "index, follow"}
                                    onValueChange={val => setFormData({ ...formData, robots_meta: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="index, follow">Index, Follow (Default)</SelectItem>
                                        <SelectItem value="noindex, follow">NoIndex, Follow</SelectItem>
                                        <SelectItem value="index, nofollow">Index, NoFollow</SelectItem>
                                        <SelectItem value="noindex, nofollow">NoIndex, NoFollow</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schema & Geo */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-green-500" />
                                    Locations & GEO
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>GEO Coordinates</Label>
                                    <Input
                                        value={formData.geo_location || ""}
                                        onChange={e => setFormData({ ...formData, geo_location: e.target.value })}
                                        placeholder="e.g., 28.6139, 77.2090"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="flex-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code className="h-5 w-5 text-yellow-500" />
                                    Schema Markup (JSON-LD)
                                </CardTitle>
                                <CardDescription>
                                    Paste valid JSON for structured data.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Textarea
                                        value={formData.schema_markup || ""}
                                        onChange={e => setFormData({ ...formData, schema_markup: e.target.value })}
                                        className="h-48 font-mono text-xs"
                                        placeholder='{ "@context": "https://schema.org", ... }'
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <Button onClick={handleSave} disabled={saving} size="lg" className="w-full md:w-auto">
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save SEO Settings
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
