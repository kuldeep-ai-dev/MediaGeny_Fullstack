"use server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface Appointment {
    id: string
    name: string
    email: string
    phone: string
    service_type?: string
    preferred_date?: string
    message: string
    inquiry_source: string
    inquiry_type: string
    status: 'pending' | 'contacted' | 'closed'
    created_at: string
}

// Public: Submit Inquiry (Appointment or General)
export async function submitAppointment(data: Partial<Appointment>) {
    const { error } = await supabase.from("appointments").insert({
        ...data,
        status: 'pending',
        // Set defaults if not provided
        inquiry_source: data.inquiry_source || 'Contact Page',
        inquiry_type: data.inquiry_type || 'General'
    })

    if (error) return { success: false, error: error.message }

    revalidatePath("/admin/appointments")
    return { success: true }
}

// Admin: Get All
export async function getAppointments() {
    const { data } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false })

    return data as Appointment[] || []
}

// Admin: Update Status
export async function updateAppointmentStatus(id: string, status: 'pending' | 'contacted' | 'closed') {
    const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id)

    if (error) return { success: false, error: error.message }

    revalidatePath("/admin/appointments")
    return { success: true }
}

// Admin: Delete
export async function deleteAppointment(id: string) {
    const { error } = await supabase.from("appointments").delete().eq("id", id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/admin/appointments")
    return { success: true }
}

// Admin: Get Count of Pending Inquiries
export async function getPendingInquiryCount() {
    const { count, error } = await supabase
        .from("appointments")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending")

    if (error) {
        console.error("Error fetching pending count:", error)
        return 0
    }

    return count || 0
}
