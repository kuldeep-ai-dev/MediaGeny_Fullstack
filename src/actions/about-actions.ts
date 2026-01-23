"use server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface CompanyProfile {
    id?: number
    story: string
    mission: string
    vision: string
    founder_name: string
    founder_bio: string
    founder_image: string
    address?: string
    phone?: string
    phone_2?: string
    email?: string
    map_embed_url?: string
    // Socials
    social_twitter?: string
    social_linkedin?: string
    social_instagram?: string
    social_facebook?: string
    // Stats
    stat_projects?: number
    stat_clients?: number
    stat_years?: number
    stat_team?: number
}

export interface TeamMember {
    id: string
    name: string
    role: string
    image_url: string
    bio?: string
    display_order: number
}

export interface LegalDocument {
    id: string
    title: string
    description: string
    file_url: string
    last_updated: string
}

// --- Company Profile ---

export async function getCompanyProfile() {
    try {
        const { data, error } = await supabase.from("company_profile").select("*").single()
        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found", which is fine (returns null)
            console.error("Error fetching company profile:", error)
        }
        return data as CompanyProfile
    } catch (err) {
        console.error("Exception fetching company profile:", err)
        return null
    }
}

export async function updateCompanyProfile(data: Partial<CompanyProfile>) {
    // Ensure we are updating row 1
    const { error } = await supabase.from("company_profile").update(data).eq("id", 1)

    if (error) return { success: false, error: error.message }

    revalidatePath("/about")
    revalidatePath("/admin/about")
    return { success: true }
}

// --- Team Members ---

export async function getTeamMembers() {
    const { data } = await supabase.from("team_members").select("*").order("display_order", { ascending: true })
    return data as TeamMember[] || []
}

export async function createTeamMember(data: Partial<TeamMember>) {
    const { error } = await supabase.from("team_members").insert(data)
    if (error) return { success: false, error: error.message }

    revalidatePath("/about")
    revalidatePath("/admin/about")
    return { success: true }
}

export async function deleteTeamMember(id: string) {
    const { error } = await supabase.from("team_members").delete().eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/about")
    revalidatePath("/admin/about")
    return { success: true }
}

// --- Legal Documents ---

export async function getLegalDocuments() {
    const { data } = await supabase.from("legal_documents").select("*").order("created_at", { ascending: false })
    return data as LegalDocument[] || []
}

export async function createLegalDocument(data: Partial<LegalDocument>) {
    const { error } = await supabase.from("legal_documents").insert(data)
    if (error) return { success: false, error: error.message }

    revalidatePath("/legal")
    revalidatePath("/admin/about")
    return { success: true }
}

export async function deleteLegalDocument(id: string) {
    const { error } = await supabase.from("legal_documents").delete().eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/legal")
    revalidatePath("/admin/about")
    return { success: true }
}
