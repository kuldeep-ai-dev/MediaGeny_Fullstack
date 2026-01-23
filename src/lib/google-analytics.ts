import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Helper to get formatted date ranges
const getDateRanges = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    return {
        startDate: '30daysAgo',
        endDate: 'today',
    }
}

async function getGASecrets() {
    // 1. Try DB
    const { data } = await supabaseAdmin
        .from("admin_config")
        .select("key, value")
        .in("key", ["ga_property_id", "ga_credentials_json"])

    const dbPropId = data?.find(c => c.key === "ga_property_id")?.value
    const dbCreds = data?.find(c => c.key === "ga_credentials_json")?.value

    if (dbPropId && dbCreds) {
        try {
            return { propertyId: dbPropId, credentials: JSON.parse(dbCreds) }
        } catch (e) {
            console.error("Failed to parse stored credentials JSON", e)
        }
    }

    // 2. Try Env
    const envPropId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
    const envCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

    if (envPropId && envCreds) {
        try {
            return { propertyId: envPropId, credentials: JSON.parse(envCreds) }
        } catch {
            return null
        }
    }

    return null
}

export interface AnalyticsData {
    views: string
    users: string
    engagement: string
    bounce: string
    timeline: { date: string, views: number }[]
}

export async function fetchGoogleAnalyticsData(): Promise<AnalyticsData | null> {
    const secrets = await getGASecrets()

    if (!secrets) {
        return null // Config missing
    }

    try {
        const { propertyId, credentials } = secrets
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials,
        })

        // 1. Fetch Totals
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
                { name: 'userEngagementDuration' },
                { name: 'bounceRate' },
            ],
        })

        // 2. Fetch Timeline
        const [timelineResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'date' }], // Returns YYYYMMDD
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' } }],
        })

        const row = response.rows?.[0]
        if (!row) return null

        const views = row.metricValues?.[0]?.value || "0"
        const users = row.metricValues?.[1]?.value || "0"
        const engagementTime = row.metricValues?.[2]?.value || "0"
        const bounceRate = row.metricValues?.[3]?.value || "0"

        // Process Timeline
        const timeline = timelineResponse.rows?.map(r => {
            const d = r.dimensionValues?.[0]?.value || ""
            // Format YYYYMMDD to nicer JS Date
            const dateStr = d.length === 8 ? `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}` : d
            return {
                date: dateStr,
                views: parseInt(r.metricValues?.[0]?.value || "0")
            }
        }) || []

        return {
            views: views,
            users: users,
            engagement: (parseFloat(engagementTime) / 60).toFixed(1) + "m",
            bounce: (parseFloat(bounceRate) * 100).toFixed(1) + "%",
            timeline
        }

    } catch (error) {
        console.error("Google Analytics Fetch Error:", error)
        return null
    }
}
