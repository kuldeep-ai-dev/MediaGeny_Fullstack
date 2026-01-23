"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, Save, FileText, MapPin, Phone, Mail, Globe } from "lucide-react"
import {
    getCompanyProfile,
    updateCompanyProfile,
    getTeamMembers,
    createTeamMember,
    deleteTeamMember,
    getLegalDocuments,
    createLegalDocument,
    deleteLegalDocument,
    CompanyProfile,
    TeamMember,
    LegalDocument
} from "@/actions/about-actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminAboutPage() {
    const [profile, setProfile] = useState<CompanyProfile | null>(null)
    const [team, setTeam] = useState<TeamMember[]>([])
    const [legalDocs, setLegalDocs] = useState<LegalDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setIsLoading(true)
        const [profileData, teamData, legalData] = await Promise.all([
            getCompanyProfile(),
            getTeamMembers(),
            getLegalDocuments()
        ])
        setProfile(profileData)
        setTeam(teamData)
        setLegalDocs(legalData)
        setIsLoading(false)
    }

    async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.currentTarget)
        const data = {
            story: formData.get("story") as string,
            mission: formData.get("mission") as string,
            vision: formData.get("vision") as string,
            founder_name: formData.get("founder_name") as string,
            founder_bio: formData.get("founder_bio") as string,
            founder_image: formData.get("founder_image") as string,
            // Contact Fields
            address: formData.get("address") as string,
            phone: formData.get("phone") as string,
            phone_2: formData.get("phone_2") as string,
            email: formData.get("email") as string,
            map_embed_url: formData.get("map_embed_url") as string,
            // Socials
            social_twitter: formData.get("social_twitter") as string,
            social_linkedin: formData.get("social_linkedin") as string,
            social_instagram: formData.get("social_instagram") as string,
            social_facebook: formData.get("social_facebook") as string,
            // Stats
            stat_projects: Number(formData.get("stat_projects")) || undefined,
            stat_clients: Number(formData.get("stat_clients")) || undefined,
            stat_years: Number(formData.get("stat_years")) || undefined,
            stat_team: Number(formData.get("stat_team")) || undefined,
        }

        const res = await updateCompanyProfile(data)
        if (res.success) {
            await loadData() // Refresh state to prevent stale hidden inputs
            alert("Company profile updated!")
        } else {
            alert("Error: " + res.error)
        }
        setIsSaving(false)
    }

    async function handleAddMember(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await createTeamMember({
            name: formData.get("name") as string,
            role: formData.get("role") as string,
            image_url: formData.get("image_url") as string,
            display_order: team.length + 1
        })
        loadData()
    }

    async function handleDeleteMember(id: string) {
        if (!confirm("Remove this team member?")) return
        await deleteTeamMember(id)
        loadData()
    }

    async function handleAddLegalDoc(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await createLegalDocument({
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            file_url: formData.get("file_url") as string,
        })
        loadData()
    }

    async function handleDeleteLegalDoc(id: string) {
        if (!confirm("Remove this document?")) return
        await deleteLegalDocument(id)
        loadData()
    }

    if (isLoading) return <div className="p-8 text-center">Loading settings...</div>

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">About & Footer Settings</h2>
                <p className="text-muted-foreground">Manage company profile, contact details, team, and legal docs.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="contact">Contact & Map</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="team">Team Members</TabsTrigger>
                    <TabsTrigger value="legal">Legal Docs</TabsTrigger>
                </TabsList>

                <TabsContent value="stats">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Home Page Statistics</CardTitle>
                            <CardDescription>Manage the counter numbers displayed on the home page.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                {/* Hidden inputs for other fields to preserve state */}
                                <input type="hidden" name="story" value={profile?.story || ""} />
                                <input type="hidden" name="mission" value={profile?.mission || ""} />
                                <input type="hidden" name="vision" value={profile?.vision || ""} />
                                <input type="hidden" name="founder_name" value={profile?.founder_name || ""} />
                                <input type="hidden" name="founder_bio" value={profile?.founder_bio || ""} />
                                <input type="hidden" name="founder_image" value={profile?.founder_image || ""} />
                                <input type="hidden" name="address" value={profile?.address || ""} />
                                <input type="hidden" name="phone" value={profile?.phone || ""} />
                                <input type="hidden" name="email" value={profile?.email || ""} />
                                <input type="hidden" name="map_embed_url" value={profile?.map_embed_url || ""} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Projects Delivered</Label>
                                        <Input type="number" name="stat_projects" defaultValue={profile?.stat_projects || 100} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Happy Clients</Label>
                                        <Input type="number" name="stat_clients" defaultValue={profile?.stat_clients || 50} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Years of Experience</Label>
                                        <Input type="number" name="stat_years" defaultValue={profile?.stat_years || 5} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Team Members</Label>
                                        <Input type="number" name="stat_team" defaultValue={profile?.stat_team || 10} />
                                    </div>
                                </div>

                                <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-primary to-secondary">
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Statistics
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>Main content for the About Us page.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                {/* Hidden inputs for contact fields so they aren't lost if managing separately or single form strategy */}
                                <input type="hidden" name="address" value={profile?.address || ""} />
                                <input type="hidden" name="phone" value={profile?.phone || ""} />
                                <input type="hidden" name="email" value={profile?.email || ""} />
                                <input type="hidden" name="map_embed_url" value={profile?.map_embed_url || ""} />

                                <div className="space-y-2">
                                    <Label>Our Story</Label>
                                    <Textarea name="story" defaultValue={profile?.story} className="min-h-[150px]" placeholder="How it all started..." />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Mission Statement</Label>
                                        <Textarea name="mission" defaultValue={profile?.mission} className="min-h-[100px]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Vision Statement</Label>
                                        <Textarea name="vision" defaultValue={profile?.vision} className="min-h-[100px]" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="text-lg font-semibold mb-4">Founder Info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Founder Name</Label>
                                            <Input name="founder_name" defaultValue={profile?.founder_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Founder Image URL</Label>
                                            <Input name="founder_image" defaultValue={profile?.founder_image} placeholder="https://..." />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Founder Bio / Message</Label>
                                            <Textarea name="founder_bio" defaultValue={profile?.founder_bio} className="min-h-[100px]" placeholder="A quote or short bio..." />
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-primary to-secondary">
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Profile
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Contact Details & Components</CardTitle>
                            <CardDescription>These details appear in the Footer and Contact section.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                {/* Hidden inputs for profile fields */}
                                <input type="hidden" name="story" value={profile?.story || ""} />
                                <input type="hidden" name="mission" value={profile?.mission || ""} />
                                <input type="hidden" name="vision" value={profile?.vision || ""} />
                                <input type="hidden" name="founder_name" value={profile?.founder_name || ""} />
                                <input type="hidden" name="founder_bio" value={profile?.founder_bio || ""} />
                                <input type="hidden" name="founder_image" value={profile?.founder_image || ""} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Office Address</Label>
                                        <Textarea name="address" defaultValue={profile?.address} placeholder="123 Innovation Dr, Tech City..." />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Primary Phone</Label>
                                            <Input name="phone" defaultValue={profile?.phone} placeholder="+91 98765 43210" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Secondary Phone</Label>
                                            <Input name="phone_2" defaultValue={profile?.phone_2} placeholder="+91 12345 67890" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email Address</Label>
                                            <Input name="email" defaultValue={profile?.email} placeholder="contact@mediageny.com" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <h3 className="font-semibold text-lg flex items-center gap-2"><Globe className="h-4 w-4" /> Social Media Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Twitter (X)</Label>
                                            <Input name="social_twitter" defaultValue={profile?.social_twitter} placeholder="https://twitter.com/..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>LinkedIn</Label>
                                            <Input name="social_linkedin" defaultValue={profile?.social_linkedin} placeholder="https://linkedin.com/in/..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Instagram</Label>
                                            <Input name="social_instagram" defaultValue={profile?.social_instagram} placeholder="https://instagram.com/..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Facebook</Label>
                                            <Input name="social_facebook" defaultValue={profile?.social_facebook} placeholder="https://facebook.com/..." />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-white/10">
                                    <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Google Map Embed URL (iframe src)</Label>
                                    <Input name="map_embed_url" defaultValue={profile?.map_embed_url} placeholder="https://www.google.com/maps/embed?pb=..." />
                                    <p className="text-xs text-muted-foreground">Go to Google Maps {'>'} Share {'>'} Embed a map {'>'} Copy HTML {'>'} Paste only the content of the `src` attribute here.</p>
                                </div>

                                <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-primary to-secondary">
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Contact Info
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Team Management</CardTitle>
                                <CardDescription>Add or remove team members displayed on the About page.</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Team Member</DialogTitle>
                                        <DialogDescription>Enter details for the new team member.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddMember} className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label>Name</Label>
                                            <Input name="name" required placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Role / Title</Label>
                                            <Input name="role" required placeholder="CTO" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Image URL</Label>
                                            <Input name="image_url" placeholder="https://..." />
                                        </div>
                                        <Button type="submit" className="w-full">Add Member</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {team.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            {member.image_url ? (
                                                <img src={member.image_url} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-white/10" />
                                            )}
                                            <div>
                                                <p className="font-semibold">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-400" onClick={() => handleDeleteMember(member.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {team.length === 0 && <p className="text-center text-muted-foreground py-8">No team members added yet.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="legal">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Legal Documents</CardTitle>
                                <CardDescription>Manage downloadable documents for the Legal page.</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Document</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Legal Document</DialogTitle>
                                        <DialogDescription>Add a new downloadable document to the list.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddLegalDoc} className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label>Document Title</Label>
                                            <Input name="title" required placeholder="Privacy Policy" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input name="description" placeholder="Short description..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>File URL (PDF)</Label>
                                            <Input name="file_url" required placeholder="https://..." />
                                        </div>
                                        <Button type="submit" className="w-full">Add Document</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {legalDocs.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{doc.title}</p>
                                                <p className="text-sm text-muted-foreground">{doc.description}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-400" onClick={() => handleDeleteLegalDoc(doc.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {legalDocs.length === 0 && <p className="text-center text-muted-foreground py-8">No legal documents added yet.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
