import { AdminHeader } from "@/components/admin/AdminHeader"
import { PortfolioManager } from "@/components/admin/PortfolioManager"

export default function AdminPortfolioPage() {
    return (
        <div className="flex flex-col gap-6">
            <AdminHeader title="Portfolio Management" />
            <PortfolioManager />
        </div>
    )
}
