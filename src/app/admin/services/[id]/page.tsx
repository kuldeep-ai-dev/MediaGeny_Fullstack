"use client"

import { useEffect, useState, use } from "react"
// ... (imports remain)
import {
    getService, updateServiceGeneral, upsertFaq, deleteFaq as deleteFaqAction,
    createPortfolioItem, deletePortfolioItem,
    upsertFeature, deleteFeature as deleteFeatureAction,
    upsertTechStack, deleteTechStack as deleteTechStackAction
} from "@/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Save, ArrowLeft, Trash2, Plus, GripVertical } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ServiceEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [service, setService] = useState<any>(null)
    const [faqs, setFaqs] = useState<any[]>([])
    const [portfolio, setPortfolio] = useState<any[]>([])
    const [features, setFeatures] = useState<any[]>([])
    const [techStack, setTechStack] = useState<any[]>([])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [newWork, setNewWork] = useState({ title: "", category: "", image_url: "", link: "" })

    useEffect(() => {
        fetchData()
    }, [id])

    async function fetchData() {
        try {
            const res = await getService(id)
            if (res.success) {
                setService(res.service)
                setFaqs(res.faqs || [])
                setPortfolio(res.portfolio || [])
                setFeatures(res.features || [])
                setTechStack(res.techStack || [])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // ... (handleAddWork, handleDeleteWork, handleSaveGeneral remain similar, see below for explicit re-inclusion or assume user wants me to rewrite file if extensive changes)
    // Since I'm using replace_file_content with a large range, I should provide the full component logic to be safe or be very careful. 
    // Given the complexity of adding two new tabs and state, I will rewrite the component body.

    // --- RE-IMPLEMENTING EXISTING HANDLERS ---

    async function handleAddWork() {
        if (!newWork.title || !newWork.image_url) {
            alert("Title and Image URL are required")
            return
        }
        setSaving(true)
        const res = await createPortfolioItem({ ...newWork, service_id: id })
        if (!res.success) {
            alert("Error adding work: " + res.error)
        } else {
            setNewWork({ title: "", category: "", image_url: "", link: "" })
            const updated = await getService(id)
            if (updated.success) setPortfolio(updated.portfolio || [])
        }
        setSaving(false)
    }

    async function handleDeleteWork(workId: string) {
        if (!confirm("Are you sure?")) return
        setSaving(true)
        await deletePortfolioItem(workId, id)
        const updated = await getService(id)
        if (updated.success) setPortfolio(updated.portfolio || [])
        setSaving(false)
    }

    async function handleSaveGeneral() {
        setSaving(true)
        const res = await updateServiceGeneral(id, {
            title: service.title,
            short_description: service.short_description,
            full_description: service.full_description,
        })
        setSaving(false)
        if (!res.success) alert("Error saving changes")
    }

    function updateFaqLocal(index: number, field: string, value: string) {
        const newFaqs = [...faqs]
        newFaqs[index] = { ...newFaqs[index], [field]: value }
        setFaqs(newFaqs)
    }

    async function saveFaqs() {
        setSaving(true)
        for (const faq of faqs) {
            await upsertFaq({ ...faq, service_id: id })
        }
        const res = await getService(id)
        if (res.success) setFaqs(res.faqs || [])
        setSaving(false)
    }

    async function deleteFaq(faqId: string, index: number) {
        if (faqId) {
            await deleteFaqAction(faqId, id)
        }
        const newFaqs = [...faqs]
        newFaqs.splice(index, 1)
        setFaqs(newFaqs)
    }

    // --- NEW HANDLERS FOR FEATURES ---

    function updateFeatureLocal(index: number, field: string, value: string) {
        const newFeats = [...features]
        newFeats[index] = { ...newFeats[index], [field]: value }
        setFeatures(newFeats)
    }

    async function saveFeatures() {
        setSaving(true)
        for (const feat of features) {
            await upsertFeature({ ...feat, service_id: id })
        }
        const res = await getService(id)
        if (res.success) setFeatures(res.features || [])
        setSaving(false)
    }

    async function deleteFeature(featId: string, index: number) {
        if (featId) await deleteFeatureAction(featId, id)
        const newFeats = [...features]
        newFeats.splice(index, 1)
        setFeatures(newFeats)
    }

    // --- NEW HANDLERS FOR TECH STACK ---

    function updateTechLocal(index: number, field: string, value: string) {
        const newTech = [...techStack]
        newTech[index] = { ...newTech[index], [field]: value }
        setTechStack(newTech)
    }

    async function saveTechStack() {
        setSaving(true)
        for (const tech of techStack) {
            await upsertTechStack({ ...tech, service_id: id })
        }
        const res = await getService(id)
        if (res.success) setTechStack(res.techStack || [])
        setSaving(false)
    }

    async function deleteTech(techId: string, index: number) {
        if (techId) await deleteTechStackAction(techId, id)
        const newTech = [...techStack]
        newTech.splice(index, 1)
        setTechStack(newTech)
    }

    if (loading) return <div className="p-10"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                <h1 className="text-2xl font-bold">Edit {service?.title}</h1>
            </div>

            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="features">Why Choose Us</TabsTrigger>
                    <TabsTrigger value="tech">Technology</TabsTrigger>
                    <TabsTrigger value="faqs">FAQs</TabsTrigger>
                    <TabsTrigger value="portfolio">Recent Works</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={service?.title} onChange={e => setService({ ...service, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Short Description</Label>
                                <Textarea value={service?.short_description} onChange={e => setService({ ...service, short_description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Full Description</Label>
                                <Textarea className="min-h-[200px]" value={service?.full_description} onChange={e => setService({ ...service, full_description: e.target.value })} />
                            </div>
                            <Button onClick={handleSaveGeneral} disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="features">
                    <Card>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-4">
                                {features.map((feat, idx) => (
                                    <div key={idx} className="flex gap-4 border-b border-white/10 pb-4 items-start">
                                        <div className="pt-2"><GripVertical className="h-4 w-4 text-muted-foreground" /></div>
                                        <div className="flex-1 space-y-2">
                                            <Input placeholder="Feature Title" value={feat.title || ""} onChange={e => updateFeatureLocal(idx, 'title', e.target.value)} />
                                            <Textarea placeholder="Feature Description" value={feat.description || ""} onChange={e => updateFeatureLocal(idx, 'description', e.target.value)} />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => deleteFeature(feat.id, idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" onClick={() => setFeatures([...features, { service_id: id, title: "", description: "" }])}>
                                <Plus className="mr-2 h-4 w-4" /> Add Feature
                            </Button>
                            <div className="pt-4">
                                <Button onClick={saveFeatures} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Features
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tech">
                    <Card>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-4">
                                {techStack.map((tech, idx) => (
                                    <div key={idx} className="flex gap-4 border-b border-white/10 pb-4 items-center">
                                        <div className="pt-2"><GripVertical className="h-4 w-4 text-muted-foreground" /></div>
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <Input placeholder="Tech Name (e.g. React)" value={tech.name || ""} onChange={e => updateTechLocal(idx, 'name', e.target.value)} />
                                            <Input placeholder="Icon Name (Lucide or path)" value={tech.icon || ""} onChange={e => updateTechLocal(idx, 'icon', e.target.value)} />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => deleteTech(tech.id, idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" onClick={() => setTechStack([...techStack, { service_id: id, name: "", icon: "" }])}>
                                <Plus className="mr-2 h-4 w-4" /> Add Technology
                            </Button>
                            <div className="pt-4">
                                <Button onClick={saveTechStack} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Tech Stack
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="faqs">
                    <Card>
                        <CardContent className="space-y-6 pt-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="flex gap-4 border-b border-white/10 pb-4">
                                    <div className="flex-1 space-y-2">
                                        <Input placeholder="Question" value={faq.question || ""} onChange={e => updateFaqLocal(idx, 'question', e.target.value)} />
                                        <Textarea placeholder="Answer" value={faq.answer || ""} onChange={e => updateFaqLocal(idx, 'answer', e.target.value)} />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteFaq(faq.id, idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            ))}
                            <Button variant="outline" onClick={() => setFaqs([...faqs, { service_id: id, question: "", answer: "" }])}>
                                <Plus className="mr-2 h-4 w-4" /> Add FAQ
                            </Button>
                            <div className="pt-4">
                                <Button onClick={saveFaqs} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save FAQs
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="portfolio">
                    <Card>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {portfolio.map((work) => (
                                    <div key={work.id} className="relative group overflow-hidden rounded-md border border-white/10 bg-white/5">
                                        <div className="aspect-video w-full overflow-hidden bg-black/50">
                                            {work.image_url ? (
                                                <img src={work.image_url} alt={work.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-muted-foreground">No Image</div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <p className="font-bold truncate">{work.title}</p>
                                            <p className="text-xs text-muted-foreground">{work.category}</p>
                                        </div>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteWork(work.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Project Title</Label>
                                        <Input value={newWork.title} onChange={e => setNewWork({ ...newWork, title: e.target.value })} placeholder="e.g. EcoJuice Rebrand" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Input value={newWork.category} onChange={e => setNewWork({ ...newWork, category: e.target.value })} placeholder="e.g. Branding" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Image URL (Public Path or URL)</Label>
                                        <Input value={newWork.image_url} onChange={e => setNewWork({ ...newWork, image_url: e.target.value })} placeholder="e.g. /portfolio_1.png" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Project Link (Disabled - Missing DB Column)</Label>
                                        <Input disabled value={newWork.link} onChange={e => setNewWork({ ...newWork, link: e.target.value })} placeholder="Disabled" />
                                    </div>
                                </div>
                                <Button className="mt-4" onClick={handleAddWork} disabled={saving}>
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Add Project
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
