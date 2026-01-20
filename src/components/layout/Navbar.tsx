"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Code, Globe, Smartphone, BarChart, GraduationCap, Dumbbell, Utensils, Pill, Briefcase, Palette, Monitor } from "lucide-react"

const services = [
    {
        title: "Web Development",
        href: "/services/web-development",
        description: "Custom websites built with modern technologies like Next.js and React.",
        icon: Globe,
    },
    {
        title: "App Development",
        href: "/services/app-development",
        description: "Native and cross-platform mobile applications for iOS and Android.",
        icon: Smartphone,
    },
    {
        title: "Custom Software",
        href: "/services/custom-software",
        description: "Tailored software solutions to streamline your business operations.",
        icon: Code,
    },
    {
        title: "Social Media",
        href: "/services/social-media",
        description: "Strategic content creation and management to grow your online presence.",
        icon: BarChart,
    },
    {
        title: "Branding",
        href: "/services/branding",
        description: "Identity design and brand strategy to make your business stand out.",
        icon: Palette,
    },
    {
        title: "Kiosk Hardware",
        href: "/services/kiosk-hardware",
        description: "Bespoke hardware solutions for interactive customer experiences.",
        icon: Monitor,
    },
]

const products = [
    {
        title: "School Management",
        href: "/products/school-management",
        description: "Comprehensive education management for schools and colleges.",
        icon: GraduationCap,
    },
    {
        title: "Gym Management",
        href: "/products/gym-management",
        description: "Member tracking, billing, and scheduling for modern fitness centers.",
        icon: Dumbbell,
    },
    {
        title: "Restaurant POS",
        href: "/products/restaurant-pos",
        description: "Streamlined point-of-sale and inventory for restaurants.",
        icon: Utensils,
    },
    {
        title: "Custom Websites",
        href: "/products/custom-websites",
        description: "Tailored high-performance websites for your business.",
        icon: Globe,
    },
    {
        title: "AI Pharmacy Stock",
        href: "/products/ai-pharmacy",
        description: "Smart inventory prediction and tracking for pharmacies.",
        icon: Pill,
    },
]

const careers = [
    {
        title: "Open Positions",
        href: "/careers/jobs",
        description: "Explore current opportunities to join our team.",
        icon: Briefcase,
    },
    {
        title: "Internships",
        href: "/careers/internships",
        description: "Start your career with our mentorship programs.",
        icon: Briefcase,
    },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        MediaGeny
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Home
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover/95 backdrop-blur-md border border-white/10 rounded-xl">
                                        {services.map((component) => (
                                            <ListItem
                                                key={component.title}
                                                title={component.title}
                                                href={component.href}
                                                icon={component.icon}
                                            >
                                                {component.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover/95 backdrop-blur-md border border-white/10 rounded-xl">
                                        {products.map((component) => (
                                            <ListItem
                                                key={component.title}
                                                title={component.title}
                                                href={component.href}
                                                icon={component.icon}
                                            >
                                                {component.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Careers</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[300px] gap-3 p-4 bg-popover/95 backdrop-blur-md border border-white/10 rounded-xl">
                                        {careers.map((component) => (
                                            <ListItem
                                                key={component.title}
                                                title={component.title}
                                                href={component.href}
                                                icon={component.icon}
                                            >
                                                {component.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/blogs" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Blogs
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <Button className="rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                        Book Appointment
                    </Button>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-background/95 border-r border-white/10">
                            <div className="flex flex-col gap-6 mt-8">
                                <Link href="/" className="text-xl font-bold" onClick={() => setIsOpen(false)}>
                                    Home
                                </Link>
                                <div className="flex flex-col gap-3">
                                    <span className="text-sm font-semibold text-muted-foreground uppercase">Services</span>
                                    {services.map(item => (
                                        <Link key={item.title} href={item.href} className="text-lg pl-4" onClick={() => setIsOpen(false)}>
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <span className="text-sm font-semibold text-muted-foreground uppercase">Products</span>
                                    {products.map(item => (
                                        <Link key={item.title} href={item.href} className="text-lg pl-4" onClick={() => setIsOpen(false)}>
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                                <Link href="/contact" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full mt-4">Book Appointment</Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { icon: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                        <Icon className="h-4 w-4" />
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5 opacity-80 group-hover:opacity-100">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
