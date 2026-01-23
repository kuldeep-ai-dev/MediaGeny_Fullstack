"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { LayoutDashboard, FileText, Settings, LogOut, Users, Receipt, BarChart, CalendarRange, ChevronDown, Globe, Search, ShieldCheck, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { InquiryBadge } from "@/components/admin/InquiryBadge"

export function AdminSidebar({ className, onClose }: { className?: string, onClose?: () => void }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isWebsiteOpen, setIsWebsiteOpen] = useState(true)

    const handleLinkClick = () => {
        if (onClose) onClose()
    }

    return (
        <div className={cn("flex h-full flex-col gap-4 bg-background/50 backdrop-blur-md", className)}>
            <div className="flex-1 space-y-2 px-4 py-4 overflow-y-auto">
                <Link href="/admin">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            pathname === "/admin" ? "bg-white/10" : ""
                        )}
                        onClick={handleLinkClick}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                </Link>
                {/* Manage Website Group */}
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => setIsWebsiteOpen(!isWebsiteOpen)}
                    >
                        <span className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Manage Website
                        </span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isWebsiteOpen ? "rotate-180" : "")} />
                    </Button>

                    {isWebsiteOpen && (
                        <div className="ml-4 space-y-1 border-l border-white/10 pl-2">
                            <Link href="/admin/services">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        pathname.includes("/admin/services") ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={handleLinkClick}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Services
                                </Button>
                            </Link>

                            <Link href="/admin/portfolio">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        pathname.includes("/admin/portfolio") ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={handleLinkClick}
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    Portfolio
                                </Button>
                            </Link>

                            <Link href="/admin/products">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        pathname.includes("/admin/products") ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={handleLinkClick}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Products
                                </Button>
                            </Link>
                            <Link href="/admin/careers">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        pathname.includes("/admin/careers") ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={handleLinkClick}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Careers
                                </Button>
                            </Link>
                            <Link href="/admin/blogs">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        pathname.includes("/admin/blogs") ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={handleLinkClick}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Blogs
                                </Button>
                            </Link>
                            <Link href="/admin/about">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        pathname.includes("/admin/about") ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={handleLinkClick}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    About Page
                                </Button>
                            </Link>
                            <Link href="/admin/testimonials">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        pathname.includes("/admin/testimonials") ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={handleLinkClick}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Testimonials
                                </Button>
                            </Link>
                            <Link href="/admin/seo">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start",
                                        pathname.includes("/admin/seo") ? "bg-white/10" : ""
                                    )}
                                    onClick={handleLinkClick}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    SEO Manager
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                <Link href="/admin/invoices">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            pathname.includes("/admin/invoices") ? "bg-white/10" : ""
                        )}
                        onClick={handleLinkClick}
                    >
                        <Receipt className="mr-2 h-4 w-4" />
                        Invoices
                    </Button>
                </Link>
                <Link href="/admin/payments">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            pathname.includes("/admin/payments") ? "bg-white/10" : ""
                        )}
                        onClick={handleLinkClick}
                    >
                        <Receipt className="mr-2 h-4 w-4" />
                        Payments
                    </Button>
                </Link>
                <Link href="/admin/analytics">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            pathname.includes("/admin/analytics") ? "bg-white/10" : ""
                        )}
                        onClick={handleLinkClick}
                    >
                        <BarChart className="mr-2 h-4 w-4" />
                        Analytics
                    </Button>
                </Link>
                <Link href="/admin/appointments">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            pathname.includes("/admin/appointments") ? "bg-white/10" : ""
                        )}
                        onClick={handleLinkClick}
                    >
                        <Receipt className="mr-2 h-4 w-4" />
                        Inquiries (Appts)
                        <InquiryBadge />
                    </Button>
                </Link>
                <Link href="/admin/subscriptions">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            pathname.includes("/admin/subscriptions") ? "bg-white/10" : ""
                        )}
                        onClick={handleLinkClick}
                    >
                        <CalendarRange className="mr-2 h-4 w-4" />
                        Subscriptions
                    </Button>
                </Link>
                <Link href="/admin/reports">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            pathname.includes("/admin/reports") ? "bg-white/10" : ""
                        )}
                        onClick={handleLinkClick}
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        Reports
                    </Button>
                </Link>
                <Link href="/admin/security">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            pathname.includes("/admin/security") ? "bg-white/10" : ""
                        )}
                        onClick={handleLinkClick}
                    >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Security
                    </Button>
                </Link>
            </div>
            <div className="border-t border-white/10 p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={async () => {
                        await import("@/actions/auth-actions").then(mod => mod.logout())
                        sessionStorage.removeItem("admin_session_lock")
                        localStorage.removeItem("sb-admin-session")
                        router.push("/admin/login")
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
