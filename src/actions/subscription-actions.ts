"use server"

import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export interface SoftwareSubscription {
    id: string
    software_id: string
    software_name: string
    customer_name: string
    customer_email?: string
    amount_per_period: number
    subscription_period_days: number
    access_password: string
    status: 'active' | 'expired' | 'cancelled'
    current_period_start?: string
    current_period_end?: string
    auto_renew: boolean
    created_at: string
}

export interface SubscriptionPayment {
    id: string
    subscription_id: string
    amount: number
    payment_date: string
    period_start: string
    period_end: string
    payment_method: string
    transaction_id?: string
    status: 'pending' | 'completed' | 'failed'
    notes?: string
}

// --- Admin Actions ---

export async function createSoftwareSubscription(data: Partial<SoftwareSubscription>) {
    try {
        const payload = {
            ...data,
            status: 'active',
            auto_renew: false,
            created_at: new Date().toISOString()
        }

        const { error } = await supabase.from("software_subscriptions").insert(payload)
        if (error) throw error

        revalidatePath("/admin/subscriptions-software")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getAllSoftwareSubscriptions() {
    try {
        const { data, error } = await supabase
            .from("software_subscriptions")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) throw error
        return { success: true, data: data as SoftwareSubscription[] }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteSoftwareSubscription(id: string) {
    try {
        const { error } = await supabase.from("software_subscriptions").delete().eq("id", id)
        if (error) throw error
        revalidatePath("/admin/subscriptions-software")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function initiatePaymentForPeriod(subscriptionId: string, periodDays: number) {
    try {
        // Get subscription details
        const { data: subscription, error: subError } = await supabase
            .from("software_subscriptions")
            .select("*")
            .eq("id", subscriptionId)
            .single()

        if (subError || !subscription) throw new Error("Subscription not found")

        // Calculate period dates
        const now = new Date()
        const periodStart = subscription.current_period_end
            ? new Date(subscription.current_period_end)
            : now
        const periodEnd = new Date(periodStart)
        periodEnd.setDate(periodEnd.getDate() + periodDays)

        // Create payment record
        const { error: paymentError } = await supabase.from("subscription_payments").insert({
            subscription_id: subscriptionId,
            amount: subscription.amount_per_period,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString(),
            status: 'pending'
        })

        if (paymentError) throw paymentError

        revalidatePath("/admin/subscriptions-software")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// --- Public/Client Actions ---

export async function verifyAndFetchSubscription(softwareId: string, password: string) {
    try {
        // Fetch subscription
        const { data, error } = await supabase
            .from("software_subscriptions")
            .select("*")
            .eq("software_id", softwareId)
            .single()

        if (error || !data) {
            return { success: false, error: "Invalid Software ID" }
        }

        // Check password
        if (data.access_password !== password) {
            return { success: false, error: "Invalid Credentials" }
        }

        return { success: true, data: data as SoftwareSubscription }

    } catch (error: any) {
        return { success: false, error: "System error occurred" }
    }
}

export async function getSubscriptionWithPayments(softwareId: string, password: string) {
    try {
        // Verify credentials first
        const verifyResult = await verifyAndFetchSubscription(softwareId, password)
        if (!verifyResult.success || !verifyResult.data) {
            return { success: false, error: verifyResult.error }
        }

        const subscription = verifyResult.data

        // Fetch payment history
        const { data: payments, error: paymentsError } = await supabase
            .from("subscription_payments")
            .select("*")
            .eq("subscription_id", subscription.id)
            .order("created_at", { ascending: false })

        if (paymentsError) throw paymentsError

        return {
            success: true,
            subscription,
            payments: payments as SubscriptionPayment[]
        }

    } catch (error: any) {
        return { success: false, error: "System error occurred" }
    }
}

export async function recordPayment(paymentId: string) {
    try {
        // Get payment details
        const { data: payment, error: paymentError } = await supabase
            .from("subscription_payments")
            .select("*")
            .eq("id", paymentId)
            .single()

        if (paymentError || !payment) throw new Error("Payment not found")

        // Update payment status
        const { error: updateError } = await supabase
            .from("subscription_payments")
            .update({
                status: 'completed',
                payment_date: new Date().toISOString(),
                transaction_id: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            })
            .eq("id", paymentId)

        if (updateError) throw updateError

        // Update subscription period
        const { error: subUpdateError } = await supabase
            .from("software_subscriptions")
            .update({
                current_period_start: payment.period_start,
                current_period_end: payment.period_end,
                status: 'active'
            })
            .eq("id", payment.subscription_id)

        if (subUpdateError) throw subUpdateError

        revalidatePath("/admin/subscriptions-software")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
