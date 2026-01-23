"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface PageSeoData {
    page_key: string
    title: string | null
    description: string | null
    keywords: string | null
    og_title: string | null
    og_description: string | null
    og_image: string | null
    canonical_url: string | null
    robots_meta: string | null
    schema_markup: any
    geo_location: string | null
}

export async function getPageSeo(pageKey: string) {
    try {
        const { data, error } = await supabase
            .from("page_seo")
            .select("*")
            .eq("page_key", pageKey)
            .single()

        if (error && error.code !== "PGRST116") {
            return { success: false, error: error.message }
        }

        return { success: true, data: data as PageSeoData | null }
    } catch (error) {
        return { success: false, error: "Failed to fetch SEO data" }
    }
}

export async function updatePageSeo(data: PageSeoData) {
    try {
        const { error } = await supabase
            .from("page_seo")
            .upsert({
                page_key: data.page_key,
                title: data.title,
                description: data.description,
                keywords: data.keywords,
                og_title: data.og_title,
                og_description: data.og_description,
                og_image: data.og_image,
                canonical_url: data.canonical_url,
                robots_meta: data.robots_meta,
                schema_markup: data.schema_markup,
                geo_location: data.geo_location,
                updated_at: new Date().toISOString()
            })

        if (error) throw error

        revalidatePath("/")
        revalidatePath(`/${data.page_key === 'home' ? '' : data.page_key}`)

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
