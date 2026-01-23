"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "./AdminSidebar"
import { useState } from "react"

export function AdminHeader({ title }: { title?: string }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center border-b border-white/10 bg-background/80 backdrop-blur-xl px-4 lg:px-6">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger */}
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0 border-r border-white/10 bg-black/90 backdrop-blur-xl">
                        <AdminSidebar onClose={() => setIsMobileOpen(false)} />
                    </SheetContent>
                </Sheet>

                <h1 className="text-xl font-bold tracking-tight">
                    {title || "MediaGeny Admin"}
                </h1>
            </div>

            {/* Right Side Actions (Optional) */}
            <div className="ml-auto flex items-center gap-2">
                {/* Add Header Actions here if needed */}
            </div>
        </header>
    )
}
