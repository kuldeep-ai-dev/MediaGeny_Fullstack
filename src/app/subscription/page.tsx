"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, CreditCard, CheckCircle2, AlertCircle, Loader2, Search, Calendar, Clock, Receipt } from "lucide-react"
import { getSubscriptionWithPayments, recordPayment, SoftwareSubscription, SubscriptionPayment } from "@/actions/subscription-actions"
import { calculateRemainingDays } from "@/lib/subscription-utils"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function SubscriptionPage() {
    const [step, setStep] = useState(1) // 1: Login, 2: Dashboard, 3: Success
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Login State
    const [credentials, setCredentials] = useState({
        software_id: "",
        password: ""
    })

    // Data State
    const [subscription, setSubscription] = useState<SoftwareSubscription | null>(null)
    const [payments, setPayments] = useState<SubscriptionPayment[]>([])
    const [pendingPayment, setPendingPayment] = useState<SubscriptionPayment | null>(null)

    // Handler: Verify Credentials
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await getSubscriptionWithPayments(credentials.software_id, credentials.password)

            if (res.success && res.subscription) {
                setSubscription(res.subscription)
                setPayments(res.payments || [])

                // Find pending payment
                const pending = res.payments?.find(p => p.status === 'pending')
                setPendingPayment(pending || null)

                setStep(2) // Go to dashboard
            } else {
                setError(res.error || "Invalid credentials")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    // Handler: Process Payment
    async function handlePayment() {
        if (!pendingPayment) return
        setLoading(true)

        try {
            // Simulate payment delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            const res = await recordPayment(pendingPayment.id)
            if (res.success) {
                setStep(3)
                toast.success("Payment successful!")
            } else {
                toast.error("Payment failed: " + res.error)
            }
        } catch (err) {
            toast.error("Payment processing error")
        } finally {
            setLoading(false)
        }
    }

    const remainingDays = subscription ? calculateRemainingDays(subscription) : 0
    const completedPayments = payments.filter(p => p.status === 'completed')

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <Link href="/">
                        <img src="/logo-wide.png" alt="MediaGeny" className="h-12 w-auto mx-auto mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Subscription Portal</h1>
                </div>

                {step === 1 && (
                    <Card className="border-white/10 bg-black/40 backdrop-blur-xl max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle>Customer Login</CardTitle>
                            <CardDescription>Enter your Software ID and access password.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-white">Software ID</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="MG-SW-XXXX"
                                            className="pl-9 bg-white/5 border-white/10"
                                            value={credentials.software_id}
                                            onChange={e => setCredentials({ ...credentials, software_id: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-9 bg-white/5 border-white/10"
                                            value={credentials.password}
                                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                <Button type="submit" className="w-full h-11" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Continue"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === 2 && subscription && (
                    <div className="space-y-6">
                        {/* Subscription Overview */}
                        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>Subscription Overview</CardTitle>
                                <CardDescription>{subscription.software_name}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                            <Calendar className="h-4 w-4" />
                                            Remaining Days
                                        </div>
                                        <div className="text-3xl font-bold text-primary">{remainingDays}</div>
                                        {subscription.current_period_end && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Until {format(new Date(subscription.current_period_end), 'dd MMM yyyy')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                            <CreditCard className="h-4 w-4" />
                                            Amount per Period
                                        </div>
                                        <div className="text-3xl font-bold text-white">₹{subscription.amount_per_period.toLocaleString('en-IN')}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{subscription.subscription_period_days} days</div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                                            <Clock className="h-4 w-4" />
                                            Status
                                        </div>
                                        <Badge
                                            variant={subscription.status === 'active' ? 'default' : 'outline'}
                                            className={
                                                subscription.status === 'active'
                                                    ? 'bg-green-500/20 text-green-500 border-green-500/50 text-lg px-3 py-1'
                                                    : 'text-red-500 border-red-500/50 text-lg px-3 py-1'
                                            }
                                        >
                                            {subscription.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Pending Payment */}
                                {pendingPayment && (
                                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mt-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-yellow-500 flex items-center gap-2">
                                                    <AlertCircle className="h-5 w-5" />
                                                    Pending Payment
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Period: {format(new Date(pendingPayment.period_start), 'dd MMM yyyy')} - {format(new Date(pendingPayment.period_end), 'dd MMM yyyy')}
                                                </p>
                                                <p className="text-2xl font-bold text-white mt-2">₹{pendingPayment.amount.toLocaleString('en-IN')}</p>
                                            </div>
                                            <Button
                                                onClick={handlePayment}
                                                className="bg-green-600 hover:bg-green-700"
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                                                Pay Now
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment History */}
                        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    Payment History
                                </CardTitle>
                                <CardDescription>All completed payments for this subscription</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {completedPayments.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/10">
                                                <TableHead className="text-white">Payment Date</TableHead>
                                                <TableHead className="text-white">Period</TableHead>
                                                <TableHead className="text-white">Amount</TableHead>
                                                <TableHead className="text-white">Transaction ID</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {completedPayments.map((payment) => (
                                                <TableRow key={payment.id} className="border-white/10">
                                                    <TableCell className="text-white">
                                                        {format(new Date(payment.payment_date), 'dd MMM yyyy, hh:mm a')}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {format(new Date(payment.period_start), 'dd MMM')} - {format(new Date(payment.period_end), 'dd MMM yyyy')}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-green-500">
                                                        ₹{payment.amount.toLocaleString('en-IN')}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                                        {payment.transaction_id || 'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No payment history yet.
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" onClick={() => setStep(1)} className="w-full">
                                    Logout
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}

                {step === 3 && subscription && (
                    <Card className="border-green-500/30 bg-green-500/5 backdrop-blur-xl max-w-md mx-auto">
                        <CardContent className="pt-10 pb-10 text-center space-y-6">
                            <div className="h-24 w-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 mb-6">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                                <p className="text-muted-foreground">
                                    Thank you, {subscription.customer_name}.<br />
                                    Your subscription for <strong>{subscription.software_name}</strong> has been extended.
                                </p>
                            </div>

                            <div className="p-4 bg-black/20 rounded-lg inline-block text-left min-w-[200px]">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">New Expiry Date</p>
                                {subscription.current_period_end && (
                                    <p className="font-semibold text-lg text-white">
                                        {format(new Date(subscription.current_period_end), 'dd MMMM yyyy')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Button onClick={() => window.location.reload()} className="mt-4">
                                    View Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
