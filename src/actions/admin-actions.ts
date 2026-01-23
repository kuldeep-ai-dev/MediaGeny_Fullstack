"use server"

import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function getServices() {
    try {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("created_at", { ascending: true })

        if (error) {
            console.error("Admin getServices Error:", error)
            throw error
        }
        return { success: true, data }
    } catch (error: any) {
        console.error("Admin getServices Exception:", error)
        return { success: false, error: error.message }
    }
}

export async function createService(title: string, icon_name: string = "Code") {
    try {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        const { data, error } = await supabase
            .from("services")
            .insert({
                title,
                slug,
                short_description: "New service description",
                full_description: "Detailed description here.",
                icon_name: icon_name || "Code",
                gradient: "from-gray-500 to-gray-700"
            })
            .select()
            .single()

        if (error) throw error
        revalidatePath("/admin/services")
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// ... (existing updateServiceGeneral from lines 39-49 remains unchanged, implied by tool usage pattern if not replacing it)

// But I need to replace getService (lines 20-37) AND add new functions.
// To keep it clean, I will first replace getService, then append the new functions at the end of the file or insert them.
// Actually, with replace_file_content I need a contiguous block.
// I can do this in two overlapping edits or one large edit.
// Let's replace getService first.

export async function getService(id: string) {
    try {
        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("id", id)
            .single()

        if (serviceError) throw serviceError

        const { data: faqs } = await supabase.from("service_faqs").select("*").eq("service_id", id).order("created_at", { ascending: true })
        const { data: portfolio } = await supabase.from("service_portfolio").select("*").eq("service_id", id).order("created_at", { ascending: false })
        const { data: features } = await supabase.from("service_features").select("*").eq("service_id", id).order("created_at", { ascending: true })
        const { data: techStack } = await supabase.from("service_tech_stack").select("*").eq("service_id", id).order("created_at", { ascending: true })

        return {
            success: true,
            service,
            faqs: faqs || [],
            portfolio: portfolio || [],
            features: features || [],
            techStack: techStack || []
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateServiceGeneral(id: string, data: any) {
    try {
        const { error } = await supabase.from("services").update(data).eq("id", id)
        if (error) throw error
        revalidatePath(`/admin/services/${id}`)
        revalidatePath(`/admin`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function upsertFaq(faq: any) {
    try {
        const { error } = await supabase.from("service_faqs").upsert(faq)
        if (error) throw error
        revalidatePath(`/admin/services/${faq.service_id}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteFaq(id: string, serviceId: string) {
    try {
        const { error } = await supabase.from("service_faqs").delete().eq("id", id)
        if (error) throw error
        revalidatePath(`/admin/services/${serviceId}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function upsertFeature(feature: any) {
    try {
        const payload = {
            id: feature.id,
            service_id: feature.service_id,
            title: feature.title,
            description: feature.description
        }
        if (!payload.id) delete payload.id;

        const { data, error } = await supabase.from("service_features").upsert(payload).select()
        if (error) throw error

        revalidatePath(`/admin/services/${feature.service_id}`)
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteFeature(id: string, serviceId: string) {
    try {
        const { error } = await supabase.from("service_features").delete().eq("id", id)
        if (error) throw error
        revalidatePath(`/admin/services/${serviceId}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function upsertTechStack(tech: any) {
    try {
        const payload = {
            id: tech.id,
            service_id: tech.service_id,
            name: tech.name,
            icon: tech.icon
        }
        if (!payload.id) delete payload.id;

        const { data, error } = await supabase.from("service_tech_stack").upsert(payload).select()
        if (error) throw error

        revalidatePath(`/admin/services/${tech.service_id}`)
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteTechStack(id: string, serviceId: string) {
    try {
        const { error } = await supabase.from("service_tech_stack").delete().eq("id", id)
        if (error) throw error
        revalidatePath(`/admin/services/${serviceId}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function createPortfolioItem(item: any) {
    try {
        console.log("Admin Action: Creating portfolio item", item)
        // Sanitize payload to match schema (id, service_id, title, category, image_url)
        const payload = {
            service_id: item.service_id,
            title: item.title,
            category: item.category,
            image_url: item.image_url
        }

        const { data, error } = await supabase.from("service_portfolio").insert(payload).select()

        if (error) {
            console.error("Supabase Insert Error:", error)
            throw error
        }

        console.log("Insert Success:", data)
        revalidatePath(`/admin/services/${item.service_id}`)
        return { success: true, data }
    } catch (error: any) {
        console.error("Create Portfolio Item Action Failed:", error)
        return { success: false, error: error.message }
    }
}


export async function deletePortfolioItem(id: string, serviceId: string) {
    try {
        const { error } = await supabase.from("service_portfolio").delete().eq("id", id)
        if (error) throw error
        revalidatePath(`/admin/services/${serviceId}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteService(id: string) {
    try {
        // Delete related data first (manual cascade to be safe)
        await supabase.from("service_features").delete().eq("service_id", id)
        await supabase.from("service_tech_stack").delete().eq("service_id", id)
        await supabase.from("service_portfolio").delete().eq("service_id", id)
        await supabase.from("service_faqs").delete().eq("service_id", id)

        // Delete the service itself
        const { error } = await supabase.from("services").delete().eq("id", id)

        if (error) throw error

        revalidatePath("/admin/services")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
