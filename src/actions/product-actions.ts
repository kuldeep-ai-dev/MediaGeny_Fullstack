"use server"

import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function getProducts() {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getProduct(id: string) {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getProductBySlug(slug: string) {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("slug", slug)
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function createProduct(data: any) {
    try {
        // Auto-generate or sanitize slug
        if (data.title) {
            const rawSlug = data.slug || data.title
            data.slug = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }

        const { data: product, error } = await supabase
            .from("products")
            .insert(data)
            .select()
            .single()

        if (error) throw error

        revalidatePath("/admin/products")
        revalidatePath("/products")
        return { success: true, data: product }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateProduct(id: string, data: any) {
    try {
        // Sanitize slug if present
        if (data.slug) {
            data.slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }

        const { error } = await supabase
            .from("products")
            .update(data)
            .eq("id", id)

        if (error) throw error

        revalidatePath("/admin/products")
        revalidatePath("/products")
        revalidatePath(`/products/${data.slug}`)

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteProduct(id: string) {
    try {
        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id)

        if (error) throw error

        revalidatePath("/admin/products")
        revalidatePath("/products")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
