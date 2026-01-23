import { AdminSecuritySettings } from "@/components/admin/AdminSecuritySettings"

export default function SecurityPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Security Settings</h2>
                <p className="text-muted-foreground">
                    Manage your admin account credentials and security preferences.
                </p>
            </div>
            <AdminSecuritySettings />
        </div>
    )
}
