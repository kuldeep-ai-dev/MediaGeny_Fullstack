"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useSpring, useMotionValue } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Users, Briefcase, Award, Clock } from "lucide-react"

interface StatsProps {
    projects: number
    clients: number
    years: number
    team: number
}

function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: "-100px" })
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
    })

    useEffect(() => {
        if (inView) {
            motionValue.set(value)
        }
    }, [inView, value, motionValue])

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString()
            }
        })
    }, [springValue])

    return <span ref={ref} className="tabular-nums" />
}

export function StatsCounter({ projects, clients, years, team }: StatsProps) {
    const stats = [
        { label: "Projects Delivered", value: projects, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Happy Clients", value: clients, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Years Experience", value: years, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Team Members", value: team, icon: Award, color: "text-orange-500", bg: "bg-orange-500/10" },
    ]

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10" />
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 -z-20" />

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${stat.bg}`}>
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">
                                <Counter value={stat.value} />+
                            </div>
                            <p className="text-muted-foreground font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
