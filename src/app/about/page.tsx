import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCompanyProfile, getTeamMembers } from "@/actions/about-actions"
import Link from "next/link"
import { ArrowRight, CheckCircle2, FileText, Target, Users } from "lucide-react"

export const metadata = {
    title: "About Us | MediaGeny",
    description: "Learn about our story, mission, and the team driving digital innovation.",
}

export default async function AboutPage() {
    const [profile, team] = await Promise.all([
        getCompanyProfile(),
        getTeamMembers()
    ])

    if (!profile) return <div>Loading...</div>

    return (
        <div className="min-h-screen bg-background">

            {/* Hero / Our Story */}
            <div className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <div className="mx-auto max-w-3xl">
                        <div className="flex justify-center mb-8">
                            <img src="/about-logo.png" alt="MediaGeny" className="h-24 w-auto opacity-100" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary">
                            Our Story
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            {profile.story || "The story of MediaGeny begins..."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-16 sm:py-24 bg-white/5 border-y border-white/10 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-2">
                                <Target className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Our Mission</h2>
                            <p className="text-muted-foreground">
                                {profile.mission || "Our mission statement..."}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary/50 transition-colors">
                            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary mb-2">
                                <Users className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Our Vision</h2>
                            <p className="text-muted-foreground">
                                {profile.vision || "Our future vision..."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Founder & Director */}
            <div className="py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
                        <div className="lg:pr-8 lg:pt-4">
                            <div className="lg:max-w-lg">
                                <h2 className="text-base font-semibold leading-7 text-primary">Leadership</h2>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Meet the Founder</p>
                                <p className="mt-6 text-lg leading-8 text-gray-300">
                                    "{profile.founder_bio || 'A message from our founder...'}"
                                </p>
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-white">{profile.founder_name || "Founder Name"}</h3>
                                    <p className="text-sm font-medium text-muted-foreground">Founder & Director</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] w-full rounded-2xl bg-gray-800 object-cover lg:aspect-[3/4] overflow-hidden border border-white/10 shadow-2xl relative group">
                                {profile.founder_image ? (
                                    <img src={profile.founder_image} alt={profile.founder_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                                        [Founder Photo Placeholder]
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Managing Team */}
            <div className="py-16 sm:py-24 bg-white/5 border-y border-white/10 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-12">Managing Team</h2>
                    {team.length === 0 ? (
                        <p className="text-muted-foreground">Team members will be listed here.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map((member) => (
                                <div key={member.id} className="flex flex-col items-center bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                                    <div className="h-32 w-32 rounded-full bg-zinc-800 mb-4 overflow-hidden border-2 border-primary/20">
                                        {member.image_url ? (
                                            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                        ) : null}
                                    </div>
                                    <h3 className="text-lg font-bold">{member.name}</h3>
                                    <p className="text-sm text-primary">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Corporate Profile & Legal */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="relative isolate overflow-hidden bg-zinc-900 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32 border border-white/10 group">
                        {/* Gradient Accents */}
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000 pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Transparency is our Policy
                        </h2>
                        <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                            We are a registered entity committed to ethical business practices. View our registration details, certifications, and policies.
                        </p>
                        <div className="mt-10 flex justify-center gap-x-6">
                            <Link href="/legal">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                                    <FileText className="mr-2 h-4 w-4" /> View Legal Documentation
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
