import { getJobs } from "@/actions/career-actions"
import { ApplicationForm } from "@/components/careers/ApplicationForm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Briefcase } from "lucide-react"

export const metadata = {
    title: "Open Positions | MediaGeny Careers",
    description: "Join our team and help shape the future of digital solutions.",
}

export default async function JobsPage() {
    const jobs = await getJobs("job")

    return (
        <div className="min-h-screen bg-background pt-20 pb-20">
            {/* Hero */}
            <div className="relative isolate overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl py-16 text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Open Positions
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            We are looking for passionate individuals to join our growing team. Find your next challenge here.
                        </p>
                    </div>
                </div>
            </div>

            {/* Job List */}
            <div className="container mx-auto px-4 max-w-5xl space-y-8">
                {jobs.length === 0 ? (
                    <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold">No Openings Right Now</h3>
                        <p className="text-muted-foreground mt-2">Please check back later or check our internship program.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <Card key={job.id} className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors">
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-primary">{job.title}</CardTitle>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="h-4 w-4" />
                                                    {job.department}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {job.location}
                                                </div>
                                                <Badge variant="outline">{job.type}</Badge>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <ApplicationForm job={job} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-3">{job.description}</p>

                                    {job.requirements && job.requirements.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {job.requirements.slice(0, 4).map((req, i) => (
                                                <Badge key={i} variant="secondary" className="bg-secondary/40">
                                                    {req}
                                                </Badge>
                                            ))}
                                            {job.requirements.length > 4 && (
                                                <span className="text-xs text-muted-foreground self-center">+{job.requirements.length - 4} more</span>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="md:hidden pt-0">
                                    <ApplicationForm job={job} />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Talent Pool CTA */}
                <div className="mt-16 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 p-8 text-center border border-white/10 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <h3 className="text-2xl font-bold">Don&apos;t see the right role?</h3>
                        <p className="text-muted-foreground">
                            We are always looking for talented individuals. Join our talent pool and we&apos;ll reach out when a suitable position opens up.
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
