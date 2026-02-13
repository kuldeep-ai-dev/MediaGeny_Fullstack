"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Key, CreditCard, Calendar } from "lucide-react"
import Link from "next/link"
import { getAllSoftwareSubscriptions, deleteSoftwareSubscription, initiatePaymentForPeriod } from "@/actions/subscription-actions"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SoftwareSubscriptionsPage() {
    const router = useRouter()
    const [subscriptions, setSubscriptions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSubscriptions()
    }, [])

    async function loadSubscriptions() {
        const { data, error } = await getAllSoftwareSubscriptions()
        if (error) {
            toast.error("Error loading subscriptions")
        } else {
            setSubscriptions(data || [])
        }
        setLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this subscription?")) return
        const res = await deleteSoftwareSubscription(id)
        if (res.success) {
            toast.success("Subscription deleted")
            loadSubscriptions()
        } else {
            toast.error("Failed to delete")
        }
    }

    async function handleInitiatePayment(subscriptionId: string, periodDays: number) {
        const res = await initiatePaymentForPeriod(subscriptionId, periodDays)
        if (res.success) {
            toast.success("Payment initiated successfully!")
            loadSubscriptions()
        } else {
            toast.error("Failed to initiate payment: " + res.error)
        }
    }

    if (loading) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Software Subscriptions</h1>
                    <p className="text-muted-foreground">Manage recurring software subscriptions and payments.</p>
                </div>
                <Link href="/admin/subscriptions-software/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add New Subscription
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-white">Software ID</TableHead>
                            <TableHead className="text-white">Customer / Software</TableHead>
                            <TableHead className="text-white">Amount/Period</TableHead>
                            <TableHead className="text-white">Current Period</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-right text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions && subscriptions.length > 0 ? (
                            subscriptions.map((sub) => (
                                <TableRow key={sub.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-mono text-primary font-medium">
                                        {sub.software_id}
                                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                            <Key className="h-2 w-2" /> {sub.access_password}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-white">{sub.customer_name}</div>
                                        <div className="text-xs text-muted-foreground">{sub.software_name}</div>
                                        {sub.customer_email && <div className="text-[10px] text-muted-foreground">{sub.customer_email}</div>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold">₹{sub.amount_per_period?.toLocaleString('en-IN') || 0}</div>
                                        <div className="text-xs text-muted-foreground">{sub.subscription_period_days || 30} days</div>
                                    </TableCell>
                                    <TableCell>
                                        {sub.current_period_end ? (
                                            <div>
                                                <div className="text-xs flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(sub.current_period_end), 'dd MMM yyyy')}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    Ends in {Math.ceil((new Date(sub.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No active period</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={sub.status === 'active' ? 'default' : 'outline'}
                                            className={
                                                sub.status === 'active'
                                                    ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/50'
                                                    : sub.status === 'expired'
                                                        ? 'text-red-500 border-red-500/50'
                                                        : 'text-yellow-500 border-yellow-500/50'
                                            }
                                        >
                                            {sub.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1 h-8"
                                                onClick={() => handleInitiatePayment(sub.id, sub.subscription_period_days || 30)}
                                            >
                                                <CreditCard className="h-3 w-3" />
                                                Initiate Payment
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleDelete(sub.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                    No subscriptions found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
