import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCompanyProfile } from "@/actions/about-actions"
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail, ArrowRight } from "lucide-react"

export async function Footer() {
    const profile = await getCompanyProfile()

    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
                    {/* Brand & Quick Links */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <img src="/logo-wide.png" alt="MediaGeny Logo" className="h-16 md:h-20 w-auto" />
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Empowering businesses with innovative digital solutions. Building the future, one pixel at a time.
                        </p>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 md:mb-6 text-lg">Quick Access</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors block py-1">Home</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors block py-1">About Us</Link></li>
                            <li><Link href="/careers/jobs" className="hover:text-primary transition-colors block py-1">Job Openings</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors block py-1">Book Appointment</Link></li>
                            <li><Link href="/legal" className="hover:text-primary transition-colors block py-1">Legal Documentation</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Map Container - Spans 2 cols on Tablet/Desktop if needed, but keeping separate for 4-col layout */}
                    <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Details */}
                        <div>
                            <h3 className="font-semibold text-white mb-4 md:mb-6 text-lg">Get in Touch</h3>
                            <ul className="space-y-4 text-sm">
                                <li className="flex gap-3 text-muted-foreground items-start">
                                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>{profile?.address || "123 Innovation Dr, Tech City"}</span>
                                </li>
                                <li className="flex gap-3 text-muted-foreground items-start">
                                    <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <span>{profile?.phone || "+91 98765 43210"}</span>
                                        {profile?.phone_2 && <span className="block mt-1 text-xs opacity-80">{profile.phone_2}</span>}
                                    </div>
                                </li>
                                <li className="flex gap-3 text-muted-foreground items-center">
                                    <Mail className="h-5 w-5 text-primary shrink-0" />
                                    <span className="break-all">{profile?.email || "contact@mediageny.com"}</span>
                                </li>
                            </ul>
                            <div className="flex gap-4 mt-6">
                                {profile?.social_twitter && <Link href={profile.social_twitter} className="text-muted-foreground hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Twitter className="h-5 w-5" /></Link>}
                                {profile?.social_linkedin && <Link href={profile.social_linkedin} className="text-muted-foreground hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Linkedin className="h-5 w-5" /></Link>}
                                {profile?.social_instagram && <Link href={profile.social_instagram} className="text-muted-foreground hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Instagram className="h-5 w-5" /></Link>}
                                {profile?.social_facebook && <Link href={profile.social_facebook} className="text-muted-foreground hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Facebook className="h-5 w-5" /></Link>}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="h-[200px] w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 relative shadow-inner">
                            {profile?.map_embed_url ? (
                                <iframe
                                    src={profile.map_embed_url}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-4 text-center">
                                    Map not configured. Add URL in Admin.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="border-t border-white/10 py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 md:p-10 rounded-3xl border border-white/5">
                        <div className="text-center lg:text-left max-w-xl">
                            <h3 className="text-2xl font-bold text-white mb-2">Subscribe to our newsletter</h3>
                            <p className="text-muted-foreground">Get the latest updates, articles, and resources sent to your inbox.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3">
                            <Input type="email" placeholder="Enter your email" className="bg-background/50 border-white/10 h-11" />
                            <Button type="submit" className="h-11 px-6 whitespace-nowrap">Subscribe</Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground pt-8 border-t border-white/10">
                    <p>© 2026 MediaGeny Tech Solutions. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/legal" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/site-map" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
