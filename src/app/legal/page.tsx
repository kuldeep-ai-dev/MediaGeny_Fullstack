import { Button } from "@/components/ui/button"
import { Download, FileText, ShieldCheck, Eye, Lock, Scale, RefreshCw, ExternalLink } from "lucide-react"
import Link from "next/link"
import { getLegalDocuments } from "@/actions/about-actions"
import { format } from "date-fns"

export const metadata = {
    title: "Legal Documentation | MediaGeny",
    description: "Legal documents, certifications, and policies of MediaGeny.",
}

export default async function LegalPage() {
    const documents = await getLegalDocuments()

    const staticPolicies = [
        {
            id: 'terms',
            title: 'Terms of Service',
            description: 'Agreement to terms, user obligations, and liability limitations.',
            href: '/terms-of-service',
            icon: Scale,
            colorClass: 'text-purple-500',
            bgClass: 'bg-purple-500/10'
        },
        {
            id: 'privacy',
            title: 'Privacy Policy',
            description: 'How we collect, use, and protect your personal information.',
            href: '/privacy-policy',
            icon: Lock,
            colorClass: 'text-blue-500',
            bgClass: 'bg-blue-500/10'
        },
        {
            id: 'refund',
            title: 'Refund & Cancellation Policy',
            description: 'Guidelines on cancellations, refunds, and service guarantees.',
            href: '/refund-policy',
            icon: RefreshCw,
            colorClass: 'text-orange-500',
            bgClass: 'bg-orange-500/10'
        }
    ]

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                        Legal Documentation
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We believe in full transparency. Here you can find all our public legal documents and policy statements.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-1 mb-12">
                    {/* Static Policies */}
                    {staticPolicies.map((policy) => (
                        <div key={policy.id} className="flex items-center justify-between p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-full ${policy.bgClass} flex items-center justify-center ${policy.colorClass} group-hover:bg-opacity-20 transition-colors`}>
                                    <policy.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{policy.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {policy.description}
                                    </p>
                                </div>
                            </div>
                            <Link href={policy.href}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Eye className="h-4 w-4" /> <span className="hidden sm:inline">View Policy</span>
                                </Button>
                            </Link>
                        </div>
                    ))}

                    {/* Dynamic Documents (Uploaded via Admin) */}
                    {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-500/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {doc.description}
                                        {doc.last_updated && ` • Updated ${format(new Date(doc.last_updated), 'MMM yyyy')}`}
                                    </p>
                                </div>
                            </div>
                            <Link href={doc.file_url} target="_blank">
                                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
                                    <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex flex-col md:flex-row gap-8 justify-center items-center text-center md:text-left p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-white">Committed to Compliance</h3>
                        <p className="text-muted-foreground">
                            MediaGeny adheres to all local and international business regulations. For specific legal inquiries, please contact our legal team at <span className="text-white">legal@mediageny.com</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
