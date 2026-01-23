"use server"

import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { success: false, error: "Email and password are required" }
    }

    try {
        // Fetch Admin Config from DB
        const { data: config, error } = await supabaseAdmin
            .from("admin_config")
            .select("key, value")
            .in("key", ["admin_email", "admin_password"])

        if (error) {
            console.error("Auth Error:", error)
            return { success: false, error: "Database authentication failed" }
        }

        const dbEmail = config.find(c => c.key === "admin_email")?.value
        const dbPass = config.find(c => c.key === "admin_password")?.value

        // Fallback or check
        if (email === dbEmail && password === dbPass) {
            // Set session cookie
            const cookieStore = await cookies()
            cookieStore.set("auth-token", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 // 1 day
            })

            return { success: true }
        } else {
            return { success: false, error: "Invalid credentials" }
        }

    } catch (err) {
        console.error("Unexpected Auth Error:", err)
        return { success: false, error: "Authentication system error" }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("auth-token")

    // Redirect handled by client usually, or we can use redirect() from next/navigation
    // but the component calling this might want to do cleanup first.
    return { success: true }
}

// Update Admin Username/Password
export async function updateAdminCredentials(username?: string, password?: string) {
    // 1. Update Username
    if (username) {
        const { error } = await supabaseAdmin
            .from("admin_config")
            .update({ value: username })
            .eq("key", "admin_email") // Using email as username field based on logic

        if (error) {
            console.error("Update username error:", error)
            return { success: false, error: "Failed to update username" }
        }
    }

    // 2. Update Password
    if (password) {
        const { error } = await supabaseAdmin
            .from("admin_config")
            .update({ value: password })
            .eq("key", "admin_password")

        if (error) {
            console.error("Update password error:", error)
            return { success: false, error: "Failed to update password" }
        }
    }

    return { success: true }
}
