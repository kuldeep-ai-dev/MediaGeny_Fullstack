"use server"

import { supabase } from "@/lib/supabase"

export async function getServiceBySlug(slug: string) {
    try {
        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("slug", slug)
            .single()

        if (serviceError) {
            console.error("Error fetching service by slug:", slug, serviceError)
            return { success: false, error: serviceError.message }
        }

        if (!service) return { success: false, error: "Service not found" }

        const id = service.id

        // Fetch related data in parallel
        const [faqsDist, portfolioDist, featuresDist, techStackDist] = await Promise.all([
            supabase.from("service_faqs").select("*").eq("service_id", id).order("created_at", { ascending: true }),
            supabase.from("service_portfolio").select("*").eq("service_id", id).order("created_at", { ascending: false }),
            supabase.from("service_features").select("*").eq("service_id", id).order("created_at", { ascending: true }),
            supabase.from("service_tech_stack").select("*").eq("service_id", id).order("created_at", { ascending: true })
        ])

        return {
            success: true,
            service,
            faqs: faqsDist.data || [],
            portfolio: portfolioDist.data || [],
            features: featuresDist.data || [],
            techStack: techStackDist.data || []
        }
    } catch (error: any) {
        console.error("Unexpected error in getServiceBySlug:", error)
        return { success: false, error: error.message }
    }
}

export async function getServices() {
    try {
        const { data: services, error } = await supabase
            .from("services")
            .select("title, short_description, icon_name, gradient, slug")
            .order("created_at", { ascending: true })

        if (error) {
            console.error("Error fetching services:", error)
            return { success: false, error: error.message }
        }

        return { success: true, services: services || [] }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getProducts() {
    try {
        const { data: products, error } = await supabase
            .from("products")
            .select("title, short_description, slug") // Fetch minimal needed for nav
            .order("created_at", { ascending: true })

        if (error) {
            console.error("Error fetching products:", error)
            return { success: false, error: error.message }
        }

        return { success: true, products: products || [] }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
