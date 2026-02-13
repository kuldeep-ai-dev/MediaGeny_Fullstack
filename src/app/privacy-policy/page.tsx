import { Button } from "@/components/ui/button"
import { Lock, ArrowLeft, Eye, Database, Share2, Shield } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: "Privacy Policy | MediaGeny",
    description: "How MediaGeny collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
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
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your privacy is important to us. This policy explains how we handle your data.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Introduction */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">1. Introduction</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                MediaGeny is committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our website and services.
                            </p>
                        </div>
                    </section>

                    {/* Information Collection */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Database className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">2. Information We Collect</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                We may collect personal information that you voluntarily provide to us when you:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Register for an account or subscribe to our newsletter.</li>
                                <li>Request information or support.</li>
                                <li>Participate in surveys or promotions.</li>
                            </ul>
                            <p>
                                This information may include your name, email address, phone number, and company details.
                            </p>
                        </div>
                    </section>

                    {/* Use of Information */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Eye className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide, operate, and maintain our services.</li>
                                <li>Improve, personalize, and expand our website.</li>
                                <li>Understand and analyze how you use our services.</li>
                                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Third Party Disclosure */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Share2 className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">4. Third-Party Disclosure</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                            </p>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">5. Data Security</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
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
                            Contact Data Protection Officer
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
