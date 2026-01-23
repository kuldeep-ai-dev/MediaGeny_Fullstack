"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { fetchGoogleAnalyticsData } from "@/lib/google-analytics"

export interface AnalyticsStats {
    views: string
    viewsSub: string
    leads: string
    leadsSub: string
    engagement: string
    engagementSub: string
    bounce: string
    bounceSub: string
    timeline?: { date: string, views: number }[]
}

const DEFAULT_STATS: AnalyticsStats = {
    views: '0',
    viewsSub: 'Connect Google Analytics',
    leads: '0',
    leadsSub: 'Active Users',
    engagement: '0%',
    engagementSub: 'Engagement Rate',
    bounce: '0%',
    bounceSub: 'Bounce Rate',
    timeline: []
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
    // 1. Try fetching from Google Analytics (Automatic Mode)
    const gaData = await fetchGoogleAnalyticsData()
    if (gaData) {
        return {
            views: gaData.views,
            viewsSub: 'Last 30 Days',
            leads: gaData.users,
            leadsSub: 'Active Users',
            engagement: gaData.engagement,
            engagementSub: 'Avg Engagement Time',
            bounce: gaData.bounce,
            bounceSub: 'Bounce Rate',
            timeline: gaData.timeline
        }
    }

    // 2. Return Defaults (No Fallback to DB)
    return DEFAULT_STATS
}

export async function updateAnalyticsStats(stats: AnalyticsStats) {
    // Deprecated: No more manual updates
    return { success: false, error: "Manual updates are disabled." }
}

export async function getAnalyticsConfig() {
    const { data } = await supabaseAdmin
        .from("admin_config")
        .select("key, value")
        .in("key", ["ga_property_id", "ga_credentials_json"])

    const propertyId = data?.find(c => c.key === "ga_property_id")?.value || ""
    const hasJson = !!data?.find(c => c.key === "ga_credentials_json")?.value

    // Also check env vars as fallback for initial state
    const envPropertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || ""
    const envHasJson = !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

    return {
        propertyId: propertyId || envPropertyId,
        hasJson: hasJson || envHasJson
    }
}

export async function saveAnalyticsConfig(propertyId: string, jsonKey: string) {
    const upserts = []

    if (propertyId) upserts.push({ key: "ga_property_id", value: propertyId })
    if (jsonKey) upserts.push({ key: "ga_credentials_json", value: jsonKey })

    if (upserts.length > 0) {
        const { error } = await supabaseAdmin
            .from("admin_config")
            .upsert(upserts, { onConflict: 'key' })

        if (error) return { success: false, error: error.message }
    }

    revalidatePath("/admin/analytics")
    return { success: true }
}
