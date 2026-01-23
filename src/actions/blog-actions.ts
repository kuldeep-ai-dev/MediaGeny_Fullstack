"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface Blog {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    cover_image: string
    author: string
    is_published: boolean
    published_at: string | null
    created_at: string
}

// --- Public Actions ---

export async function getPublishedBlogs() {
    const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })

    if (error) {
        console.error("Error fetching blogs:", error)
        return []
    }
    return data as Blog[]
}

export async function getBlogBySlug(slug: string) {
    const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

    if (error) return null
    return data as Blog
}


// --- Admin Actions ---

export async function getAllBlogs() {
    const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) return []
    return data as Blog[]
}

export async function createBlog(data: Partial<Blog>) {
    const slug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || "untitled"

    const { error } = await supabase.from("blogs").insert({
        ...data,
        slug
    })

    if (error) return { success: false, error: error.message }

    revalidatePath("/blogs")
    revalidatePath("/admin/blogs")
    return { success: true }
}

export async function updateBlog(id: string, data: Partial<Blog>) {
    const { error } = await supabase.from("blogs").update(data).eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/blogs")
    revalidatePath(`/blogs/${data.slug}`) // revalidate specific post if slug changed
    revalidatePath("/admin/blogs")
    return { success: true }
}

export async function deleteBlog(id: string) {
    const { error } = await supabase.from("blogs").delete().eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/blogs")
    revalidatePath("/admin/blogs")
    return { success: true }
}
