import { SeoManager } from "@/components/admin/SeoManager"

export const metadata = {
    title: "SEO Manager | MediaGeny Admin",
    description: "Manage global SEO settings.",
}

export default function SeoAdminPage() {
    return (
        <div className="container mx-auto py-10">
            <SeoManager />
        </div>
    )
}
