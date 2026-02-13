import { SoftwareSubscription } from "@/actions/subscription-actions"

export function calculateRemainingDays(subscription: SoftwareSubscription): number {
    if (!subscription.current_period_end) return 0

    const now = new Date()
    const endDate = new Date(subscription.current_period_end)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
}
