"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Initialize Supabase Client (Service Role for Admin Actions)
// Note: In a real app, use a proper server client with cookie auth for "admin" checks.
// For this portfolio/demo, we assume the API keys are present.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export type JobType = "job" | "internship"

export interface Job {
    id: string
    title: string
    type: JobType
    location: string
    department: string
    description: string
    requirements: string[]
    is_active: boolean
    created_at: string
}

export interface Application {
    id: string
    job_id: string
    candidate_name: string
    email: string
    phone: string
    resume_url: string
    cover_letter: string
    status: string
    created_at: string
    jobs?: { title: string } // Joined data
}

// --- Public Actions ---

export async function getJobs(type?: JobType) {
    let query = supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

    if (type) {
        query = query.eq("type", type)
    }

    const { data, error } = await query

    if (error) {
        console.error("Error fetching jobs:", error)
        return []
    }

    return data as Job[]
}

export async function submitApplication(formData: FormData) {
    const job_id = formData.get("job_id") as string
    const candidate_name = formData.get("candidate_name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const cover_letter = formData.get("cover_letter") as string
    // Resume handling would typically involve storage upload first, getting a URL.
    // For simplicity, we'll assume a URL string or handle file upload in a separate step/action if needed.
    // Here we'll just mock it or accept a link.
    const resume_url = formData.get("resume_url") as string

    const { error } = await supabase.from("applications").insert({
        job_id,
        candidate_name,
        email,
        phone,
        cover_letter,
        resume_url: resume_url || "https://example.com/resume.pdf", // Placeholder if not provided
        status: "pending"
    })

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }
}

// --- Admin Actions ---

export async function getAllJobs() {
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) return []
    return data as Job[]
}

export async function createJob(jobData: Omit<Job, "id" | "created_at">) {
    const { error } = await supabase.from("jobs").insert(jobData)
    if (error) return { success: false, error: error.message }

    revalidatePath("/careers")
    revalidatePath("/admin/careers")
    return { success: true }
}

export async function updateJob(id: string, jobData: Partial<Job>) {
    const { error } = await supabase.from("jobs").update(jobData).eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/careers")
    revalidatePath("/admin/careers")
    return { success: true }
}

export async function deleteJob(id: string) {
    const { error } = await supabase.from("jobs").delete().eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/careers")
    revalidatePath("/admin/careers")
    return { success: true }
}

export async function getApplications(jobId?: string) {
    let query = supabase
        .from("applications")
        .select("*, jobs(title)")
        .order("created_at", { ascending: false })

    if (jobId) {
        query = query.eq("job_id", jobId)
    }

    const { data, error } = await query
    if (error) return []
    return data as Application[]
}

export async function updateApplicationStatus(id: string, status: string) {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/admin/careers")
    return { success: true }
}

export async function deleteApplication(id: string) {
    const { error } = await supabase.from("applications").delete().eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/admin/careers")
    return { success: true }
}
