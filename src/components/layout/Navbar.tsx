"use client"

import * as React from "react"
import Link from "next/link"
import NextImage from "next/image"
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
import { Menu, X, Code, Globe, Smartphone, BarChart, GraduationCap, Dumbbell, Utensils, Pill, Briefcase, Palette, Monitor, Zap } from "lucide-react"
import { getServices, getProducts } from "@/actions/public-actions"

// Map icon strings to components
const iconMap: Record<string, any> = {
    Globe, Smartphone, Code, BarChart, Palette, Monitor, Briefcase, Zap, GraduationCap, Dumbbell, Utensils, Pill
}



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
    const [services, setServices] = React.useState<any[]>([])
    const [products, setProducts] = React.useState<any[]>([])

    React.useEffect(() => {
        const fetchData = async () => {
            const [servicesRes, productsRes] = await Promise.all([
                getServices(),
                getProducts()
            ])

            if (servicesRes.success && servicesRes.services) {
                setServices(servicesRes.services)
            }
            if (productsRes.success && productsRes.products) {
                setProducts(productsRes.products)
            }
        }
        fetchData()
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <NextImage
                        src="/logo-v2.png"
                        alt="MediaGeny"
                        width={200}
                        height={60}
                        className="h-12 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/" className={navigationMenuTriggerStyle()}>
                                        Home
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover/95 backdrop-blur-md border border-white/10 rounded-xl">
                                        {services.map((service) => {
                                            const isUrl = service.icon_name && service.icon_name.startsWith('http')
                                            const IconComponent = !isUrl ? (iconMap[service.icon_name] || Globe) : null

                                            return (
                                                <ListItem
                                                    key={service.slug}
                                                    title={service.title}
                                                    href={`/services/${service.slug}`}
                                                    icon={isUrl ? undefined : IconComponent}
                                                    customIconUrl={isUrl ? service.icon_name : undefined}
                                                >
                                                    {service.short_description}
                                                </ListItem>
                                            )
                                        })}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover/95 backdrop-blur-md border border-white/10 rounded-xl">
                                        {products.map((product) => (
                                            <ListItem
                                                key={product.slug}
                                                title={product.title}
                                                href={`/products/${product.slug}`}
                                                icon={Globe}
                                            >
                                                {product.short_description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Careers</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    {/* Removed w-[300px] fixed width to allow auto-sizing or standard shadcn alignment behavior which often fixes left-alignment issues */}
                                    <ul className="grid w-full min-w-[300px] gap-3 p-4 bg-popover/95 backdrop-blur-md border border-white/10 rounded-xl">
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
                                <NavigationMenuLink asChild>
                                    <Link href="/about" className={navigationMenuTriggerStyle()}>
                                        About Us
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/blogs" className={navigationMenuTriggerStyle()}>
                                        Blogs
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/contact">
                        <Button className="rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                            Book Appointment
                        </Button>
                    </Link>
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
                                <Link href="/about" className="text-xl font-bold" onClick={() => setIsOpen(false)}>
                                    About Us
                                </Link>
                                <div className="flex flex-col gap-3">
                                    <span className="text-sm font-semibold text-muted-foreground uppercase">Services</span>
                                    {services.map(item => (
                                        <Link key={item.title} href={`/services/${item.slug}`} className="text-lg pl-4" onClick={() => setIsOpen(false)}>
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <span className="text-sm font-semibold text-muted-foreground uppercase">Products</span>
                                    {products.map(item => (
                                        <Link key={item.title} href={`/products/${item.slug}`} className="text-lg pl-4" onClick={() => setIsOpen(false)}>
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
    React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType, customIconUrl?: string }
>(({ className, title, children, icon: Icon, customIconUrl, ...props }, ref) => {
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
                        {customIconUrl ? (
                            <NextImage src={customIconUrl} alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                        ) : (
                            Icon && <Icon className="h-4 w-4" />
                        )}
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
