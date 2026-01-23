import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { servicesData } from '@/lib/services-data'

export async function GET() {
    try {
        const results = []

        for (const service of servicesData) {
            // 1. Insert Service
            const { data: serviceRecord, error: serviceError } = await supabase
                .from('services')
                .insert({
                    slug: service.slug,
                    title: service.title,
                    short_description: service.shortDescription,
                    full_description: service.fullDescription,
                    icon_name: service.iconName,
                    gradient: service.gradient
                })
                .select()
                .single()

            if (serviceError) {
                // If it exists (likely unique constraint on slug), we skip or update. 
                // For simplicity in seeding, we just skip logging.
                console.error(`Error inserting service ${service.slug}:`, serviceError)
                results.push({ slug: service.slug, status: 'error', error: serviceError.message })
                continue
            }

            const serviceId = serviceRecord.id
            results.push({ slug: service.slug, status: 'success', id: serviceId })

            // 2. Insert Features
            if (service.features?.length > 0) {
                const featuresData = service.features.map(f => ({
                    service_id: serviceId,
                    title: f.title,
                    description: f.description
                }))
                await supabase.from('service_features').insert(featuresData)
            }

            // 3. Insert FAQs
            if (service.faq?.length > 0) {
                const faqsData = service.faq.map(f => ({
                    service_id: serviceId,
                    question: f.question,
                    answer: f.answer
                }))
                await supabase.from('service_faqs').insert(faqsData)
            }

            // 4. Insert Tech Stack
            if (service.techStack?.length > 0) {
                const techData = service.techStack.map(t => ({
                    service_id: serviceId,
                    name: t.name,
                    icon: t.icon
                }))
                await supabase.from('service_tech_stack').insert(techData)
            }

            // 5. Insert Recent Works (Portfolio)
            if (service.recentWorks?.length > 0) {
                const portfolioData = service.recentWorks.map(w => ({
                    service_id: serviceId,
                    title: w.title,
                    category: w.category,
                    image_url: w.image
                }))
                await supabase.from('service_portfolio').insert(portfolioData)
            }
        }



        // --- Seed Analytics Stats into admin_config ---
        const stats = [
            { key: 'stat_views', value: '45.2K' },
            { key: 'stat_views_sub', value: '+20.1% from last month' },
            { key: 'stat_leads', value: '+573' },
            { key: 'stat_leads_sub', value: '+201 since last week' },
            { key: 'stat_engagement', value: '12.5%' },
            { key: 'stat_engagement_sub', value: '+2.4% from last month' },
            { key: 'stat_bounce', value: '42.3%' },
            { key: 'stat_bounce_sub', value: '-1.2% from last month' },
            // Credentials Reset (Explicitly overwrite if run)
            { key: 'admin_email', value: 'kuldeep@mediageny.com' },
            { key: 'admin_password', value: '787059' },
        ]

        const { error: statsError } = await supabase.from('admin_config').upsert(stats, { onConflict: 'key' })

        if (statsError) {
            console.error("Error seeding stats:", statsError)
        } else {
            results.push({ message: "Seeded Admin Stats into admin_config" })
        }

        return NextResponse.json({ message: 'Seeding completed', results })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
