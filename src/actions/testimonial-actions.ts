"use server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface Testimonial {
    id: string
    client_name: string
    client_role: string
    content: string
    rating: number
    image_url: string
    is_featured: boolean
    created_at: string
}

// Public: Submit Review
export async function submitTestimonial(data: Partial<Testimonial>) {
    const { error } = await supabase.from("testimonials").insert({
        ...data,
        is_featured: true // Auto publishes by default as requested
    })

    if (error) return { success: false, error: error.message }

    revalidatePath("/")
    revalidatePath("/admin/testimonials")
    return { success: true }
}

// Public: Fetch for Home Page
export async function getFeaturedTestimonials() {
    const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6) // Only latest 6

    return data as Testimonial[] || []
}

// Admin: Fetch All
export async function getAllTestimonials() {
    const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })

    return data as Testimonial[] || []
}

// Admin: Toggle Visibility
export async function toggleTestimonialVisibility(id: string, currentState: boolean) {
    const { error } = await supabase
        .from("testimonials")
        .update({ is_featured: !currentState })
        .eq("id", id)

    if (error) return { success: false, error: error.message }

    revalidatePath("/")
    revalidatePath("/admin/testimonials")
    return { success: true }
}

// Admin: Delete
export async function deleteTestimonial(id: string) {
    const { error } = await supabase.from("testimonials").delete().eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/")
    revalidatePath("/admin/testimonials")
    return { success: true }
}
