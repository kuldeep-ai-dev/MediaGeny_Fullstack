"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminSecurityProvider } from "@/components/admin/AdminSecurityProvider"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()

    // Protect route via Provider and Auth Check
    useEffect(() => {
        // Double check session lock
        const session = sessionStorage.getItem("admin_session_lock")
        if (!session && !pathname.includes("/login")) {
            router.push("/admin/login")
        }
    }, [pathname, router])

    if (pathname.includes("/login")) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* 1. Fixed Top Header (Visible on Mobile & Desktop) */}
            <AdminHeader />

            <div className="flex pt-16">
                {/* 2. Desktop Sidebar (Fixed Left, starts BELOW header) */}
                <aside className="hidden w-64 border-r border-white/10 lg:flex fixed left-0 top-16 bottom-0 bg-background/50 backdrop-blur-md">
                    <AdminSidebar />
                </aside>

                {/* 3. Main Content (Pushed right by sidebar on desktop) */}
                <main className="flex-1 lg:pl-64">
                    <div className="container mx-auto max-w-5xl p-6 lg:p-10">
                        <AdminSecurityProvider>
                            {children}
                        </AdminSecurityProvider>
                    </div>
                </main>
            </div>
        </div>
    )
}
