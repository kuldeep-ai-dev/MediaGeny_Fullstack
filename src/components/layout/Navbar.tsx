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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
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
                                    <Link href="/portfolio" className={navigationMenuTriggerStyle()}>
                                        Portfolio
                                    </Link>
                                </NavigationMenuLink>
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
                        <SheetContent side="left" className="bg-background/95 border-r border-white/10 w-[300px] sm:w-[350px] overflow-y-auto">
                            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                            <div className="flex flex-col gap-4 mt-6 pb-10">
                                <Link href="/" className="text-lg font-bold py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>
                                    Home
                                </Link>

                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="services" className="border-white/5">
                                        <AccordionTrigger className="text-lg font-bold py-3 no-underline hover:no-underline">Services</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-3 pl-2 py-2">
                                                {services.map(item => (
                                                    <Link key={item.title} href={`/services/${item.slug}`} className="text-base text-muted-foreground hover:text-primary transition-colors block py-1" onClick={() => setIsOpen(false)}>
                                                        {item.title}
                                                    </Link>
                                                ))}
                                                {services.length === 0 && <span className="text-sm text-zinc-500">No services available</span>}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="products" className="border-white/5">
                                        <AccordionTrigger className="text-lg font-bold py-3 no-underline hover:no-underline">Products</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-3 pl-2 py-2">
                                                {products.map(item => (
                                                    <Link key={item.title} href={`/products/${item.slug}`} className="text-base text-muted-foreground hover:text-primary transition-colors block py-1" onClick={() => setIsOpen(false)}>
                                                        {item.title}
                                                    </Link>
                                                ))}
                                                {products.length === 0 && <span className="text-sm text-zinc-500">No products available</span>}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="careers" className="border-white/5">
                                        <AccordionTrigger className="text-lg font-bold py-3 no-underline hover:no-underline">Careers</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-3 pl-2 py-2">
                                                {careers.map(item => (
                                                    <Link key={item.title} href={item.href} className="text-base text-muted-foreground hover:text-primary transition-colors block py-1" onClick={() => setIsOpen(false)}>
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <Link href="/portfolio" className="text-lg font-bold py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>
                                    Portfolio
                                </Link>

                                <Link href="/blogs" className="text-lg font-bold py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>
                                    Blogs
                                </Link>

                                <Link href="/about" className="text-lg font-bold py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>
                                    About Us
                                </Link>

                                <div className="pt-4">
                                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-gradient-to-r from-primary to-secondary">Book Appointment</Button>
                                    </Link>
                                </div>
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
