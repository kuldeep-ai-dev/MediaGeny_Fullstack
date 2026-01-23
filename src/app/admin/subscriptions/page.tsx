import { getSubscriptions, getClients } from "@/actions/invoice-actions"
import { SubscriptionList } from "@/components/subscriptions/SubscriptionList"
import { CreateSubscriptionModal } from "@/components/subscriptions/CreateSubscriptionModal"

export default async function SubscriptionsPage() {
    const [subsRes, clientsRes] = await Promise.all([
        getSubscriptions(),
        getClients()
    ])

    const subscriptions = subsRes.success ? (subsRes.data || []) : []
    const clients = clientsRes.success ? (clientsRes.data || []) : []

    // Only show active error if critical, otherwise default to empty
    if (!subsRes.success) {
        console.error("Failed to load subscriptions:", subsRes.error)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                    <p className="text-muted-foreground">Manage monthly recurring billing.</p>
                </div>
                <CreateSubscriptionModal clients={clients} />
            </div>

            <SubscriptionList subscriptions={subscriptions} />
        </div>
    )
}
