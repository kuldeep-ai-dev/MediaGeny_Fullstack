import { Button } from "@/components/ui/button"
import { Scale, ArrowLeft, FileText, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: "Terms of Service | MediaGeny",
    description: "Terms and conditions for using MediaGeny services.",
}

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Please read these terms carefully before using our services.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Introduction */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Scale className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                By accessing or using the services provided by MediaGeny, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </div>
                    </section>

                    {/* Services */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">2. Services</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                MediaGeny provides digital marketing, web development, and related services. Specific service details, deliverables, and timelines will be outlined in your individual service agreement or project proposal.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
                                <li>We may modify or discontinue our services without prior notice.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">3. Intellectual Property</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Unless otherwise stated in a specific service agreement, MediaGeny retains ownership of all intellectual property rights for the tools, frameworks, and pre-existing code used to create your deliverables.
                            </p>
                            <p>
                                Upon full payment, the client is granted a non-exclusive, perpetual license to use the final deliverables for their intended business purpose.
                            </p>
                        </div>
                    </section>

                    {/* Liability */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                In no event shall MediaGeny, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-sm text-muted-foreground mb-6">
                        Last updated: February 13, 2026
                    </p>
                    <Link href="/contact">
                        <Button className="rounded-full px-8 py-6 h-auto text-lg">
                            Contact Legal Team
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
