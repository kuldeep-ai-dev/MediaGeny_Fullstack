"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

interface RecentWork {
    title: string
    category: string
    image: string
}

interface RecentWorksProps {
    works: RecentWork[]
}

export function RecentWorks({ works }: RecentWorksProps) {
    if (!works || works.length === 0) return null

    return (
        <div className="py-12">
            <h2 className="mb-8 text-2xl font-bold">Recent Works</h2>
            <div className="grid gap-6 sm:grid-cols-2">
                {works.map((work, index) => (
                    <div
                        key={index}
                        className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5"
                    >
                        {/* Image (Using a placeholder logic if real paths aren't set up yet, typically you'd verify these) */}
                        <div className="absolute inset-0 bg-muted/20" />
                        {/* NOTE: In a real app we'd use next/image with valid paths. For this demo we use the generated assets if moved to public, or absolute paths if local. 
                             Since generated images are in artifacts, we must move them or assume they are available. 
                             For this implementation, I will assume the images will be placed in public/ or served correctly. 
                             For now, let's render the Image component assuming standard public path behavior.
                          */}
                        <Image
                            src={work.image}
                            alt={work.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
                                <p className="text-sm font-medium text-primary">{work.category}</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white">{work.title}</h3>
                                    <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                                        <ArrowUpRight className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
