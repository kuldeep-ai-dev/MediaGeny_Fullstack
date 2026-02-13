import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowLeft, RefreshCw, XCircle, Info } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: "Refund & Cancellation Policy | MediaGeny",
    description: "Our policies regarding refunds and service cancellations at MediaGeny.",
}

export default function RefundPolicyPage() {
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
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Transparent guidelines for our service commitments and your peace of mind.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Cancellation Section */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <XCircle className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Cancellation Policy</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                At MediaGeny, we understand that business priorities can shift. Our cancellation policy is designed to be fair to both our clients and our production teams.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Cancellations requested within 24 hours of booking/order placement are eligible for a full review.</li>
                                <li>For project-based services, once work has commenced (defined by the kick-off meeting or initial delivery), cancellations may incur a fee based on the work completed.</li>
                                <li>Subscription-based services can be cancelled at any time through your dashboard, and will remain active until the end of the current billing cycle.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Refund Section */}
                    <section className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <RefreshCw className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Refund Policy</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                We strive for excellence in every pixel. If our services do not meet the agreed-upon milestones or specifications:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Refund requests must be submitted in writing within 7 days of the milestone delivery or service issue.</li>
                                <li>Partial refunds may be issued if certain components of the project were successfully delivered and accepted.</li>
                                <li>Refunds are typically processed within 5-10 business days after approval to the original payment method.</li>
                                <li>Third-party costs (domain registrations, premium stock licenses already purchased) are generally non-refundable.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Important Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-4 text-primary">
                                <Info className="h-5 w-5" />
                                <h3 className="font-bold">Contact Support</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                For any questions regarding your specific situation, please reach out to our support team at <span className="text-white">support@mediageny.com</span>.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/10">
                            <div className="flex items-center gap-3 mb-4 text-green-500">
                                <ShieldCheck className="h-5 w-5" />
                                <h3 className="font-bold">Satisfaction Guarantee</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                We are committed to working with you until you are satisfied with the results. Most issues can be resolved through our revision process.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-sm text-muted-foreground mb-6">
                        Last updated: February 13, 2026
                    </p>
                    <Link href="/contact">
                        <Button className="rounded-full px-8 py-6 h-auto text-lg">
                            Have Questions? Contact Us
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
