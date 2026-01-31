import { getAgreement, getBusinessProfile } from "@/actions/invoice-actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AgreementView } from "@/components/admin/AgreementView"

export default async function AgreementDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const [agreementRes, profileRes] = await Promise.all([
        getAgreement(id),
        getBusinessProfile()
    ])

    if (!agreementRes.success || !agreementRes.data) return notFound()

    const agreement = agreementRes.data
    const profile = profileRes.success ? profileRes.data : null

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between no-print gap-4">
                <Link href="/admin/agreements">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agreements
                    </Button>
                </Link>
            </div>

            <AgreementView agreement={agreement} profile={profile} />
        </div>
    )
}
