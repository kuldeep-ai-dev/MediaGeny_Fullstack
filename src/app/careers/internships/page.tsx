import { getJobs } from "@/actions/career-actions"
import { ApplicationForm } from "@/components/careers/ApplicationForm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, GraduationCap } from "lucide-react"

export const metadata = {
    title: "Internship Programs | MediaGeny Careers",
    description: "Kickstart your career with mentorship from industry experts.",
}

export default async function InternshipsPage() {
    const jobs = await getJobs("internship")

    return (
        <div className="min-h-screen bg-background pt-20 pb-20">
            {/* Hero */}
            <div className="relative isolate overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-16 text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Internship Program
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            Gain hands-on experience and mentorship. Start your journey with MediaGeny.
                        </p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="container mx-auto px-4 max-w-5xl space-y-8">
                {jobs.length === 0 ? (
                    <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold">No Internships Open</h3>
                        <p className="text-muted-foreground mt-2">We open internship cohorts seasonally. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {jobs.map((job) => (
                            <Card key={job.id} className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all hover:-translate-y-1">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-primary">{job.title}</CardTitle>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                {job.location} • {job.department}
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Internship</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm line-clamp-3">{job.description}</p>

                                    {job.requirements && job.requirements.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {job.requirements.slice(0, 3).map((req, i) => (
                                                <Badge key={i} variant="outline" className="text-xs border-primary/20 text-primary/80">
                                                    {req}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <div className="w-full">
                                        <ApplicationForm job={job} />
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Talent Pool CTA */}
                <div className="mt-16 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 p-8 text-center border border-white/10 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <h3 className="text-2xl font-bold">Don&apos;t see an open internship?</h3>
                        <p className="text-muted-foreground">
                            Submit your profile to our talent pool. We review profiles for off-cycle internship opportunities.
                        </p>
                        <div className="pt-2">
                            <ApplicationForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
