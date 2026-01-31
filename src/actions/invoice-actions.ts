"use server"

import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { generateNextInvoiceNumber } from "@/lib/invoice-utils";

// --- Module 1: Business Profile ---

export async function getBusinessProfile() {
    try {
        const { data, error } = await supabase.from("business_profile").select("*").single()
        // It's possible no profile exists yet, in which case data is null or error is 'PGRST116'
        if (error && error.code !== 'PGRST116') throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function saveBusinessProfile(profile: any) {
    try {
        const payload = {
            ...profile,
            updated_at: new Date().toISOString()
        }

        // Check if we are updating or inserting
        if (!payload.id) {
            const { data: existing } = await supabase.from("business_profile").select("id").limit(1).single()
            if (existing) {
                payload.id = existing.id
            }
        }

        const { data, error } = await supabase
            .from("business_profile")
            .upsert(payload)
            .select()
            .single()

        if (error) throw error

        revalidatePath("/admin/invoices/settings")
        revalidatePath("/admin/invoices", "layout")
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// --- Module 2: Clients ---

export async function getClients() {
    try {
        const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })
        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteClient(id: string) {
    try {
        const { error } = await supabase.from("clients").delete().eq("id", id)
        if (error) throw error
        revalidatePath("/admin/invoices/clients")
        revalidatePath("/admin/invoices", "layout")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function upsertClient(client: any) {
    try {
        const payload = { ...client }
        if (!payload.id) delete payload.id

        const { data, error } = await supabase.from("clients").upsert(payload).select().single()
        if (error) throw error

        revalidatePath("/admin/invoices/clients")
        revalidatePath("/admin/invoices", "layout")
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get('file') as File
        const bucket = formData.get('bucket') as string
        const path = formData.get('path') as string

        if (!file || !bucket || !path) {
            throw new Error("Missing file, bucket, or path")
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
            contentType: file.type,
            upsert: true
        })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
        return { success: true, url: publicUrl }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// --- Module 3: Invoices ---

export async function getNextInvoiceData() {
    try {
        // Get business profile for defaults
        const { data: profile } = await supabase.from("business_profile").select("*").single();

        // Get last invoice number
        const { data: lastInvoice } = await supabase
            .from("invoices")
            .select("invoice_number")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        const nextNumber = generateNextInvoiceNumber(lastInvoice?.invoice_number || null, "INV");

        return { success: true, nextNumber, profile };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createInvoice(invoiceData: any, items: any[]) {
    try {
        // 1. Create Invoice
        const { data: invoice, error: invoiceError } = await supabase
            .from("invoices")
            .insert(invoiceData)
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        // 2. Create Invoice Items
        if (items && items.length > 0) {
            const itemsWithId = items.map((item) => ({
                ...item,
                invoice_id: invoice.id,
            }));

            const { error: itemsError } = await supabase.from("invoice_items").insert(itemsWithId);

            if (itemsError) {
                // Rollback (delete invoice) if items fail
                await supabase.from("invoices").delete().eq("id", invoice.id);
                throw itemsError;
            }
        }

        revalidatePath("/admin/invoices");
        return { success: true, invoiceId: invoice.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Analytics & Dashboard ---

export async function getInvoiceStats() {
    try {
        const { count: clientCount, error: clientError } = await supabase
            .from("clients")
            .select("*", { count: 'exact', head: true });

        const { data: invoices, error: invoiceError } = await supabase
            .from("invoices")
            .select("grand_total, gst_total, created_at, status");

        if (clientError) throw clientError;
        if (invoiceError) throw invoiceError;

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        let totalRevenue = 0;
        let totalGST = 0;
        let weekRevenue = 0;
        let monthRevenue = 0;
        let yearRevenue = 0;

        invoices?.forEach(inv => {
            // ONLY COUNT REVENUE IF STATUS IS 'Paid'
            if (inv.status === 'Paid') {
                const amount = Number(inv.grand_total) || 0;
                // @ts-ignore
                const gst = Number(inv.gst_total) || 0;
                const date = new Date(inv.created_at);

                totalRevenue += amount;
                totalGST += gst;

                if (date >= startOfWeek) weekRevenue += amount;
                if (date >= startOfMonth) monthRevenue += amount;
                if (date >= startOfYear) yearRevenue += amount;
            }
        });

        const totalInvoices = invoices?.length || 0;

        return {
            success: true,
            clientCount: clientCount || 0,
            revenue: {
                total: totalRevenue,
                gst: totalGST,
                net: totalRevenue - totalGST,
                week: weekRevenue,
                month: monthRevenue,
                year: yearRevenue
            },
            totalInvoices
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getTopClients() {
    try {
        const { data: invoices, error } = await supabase
            .from("invoices")
            .select("grand_total, status, clients(name, company_name, email)")

        if (error) throw error

        const clientStats: Record<string, { name: string, company: string, revenue: number, invoices: number }> = {}

        invoices?.forEach(inv => {
            if (inv.status === 'Paid' && inv.clients) {
                // @ts-ignore
                const name = inv.clients.company_name || inv.clients.name || "Unknown"
                if (!clientStats[name]) {
                    clientStats[name] = {
                        // @ts-ignore
                        name: inv.clients.name,
                        // @ts-ignore
                        company: inv.clients.company_name,
                        revenue: 0,
                        invoices: 0
                    }
                }
                clientStats[name].revenue += Number(inv.grand_total) || 0
                clientStats[name].invoices += 1
            }
        })

        const sortedClients = Object.values(clientStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)

        return { success: true, data: sortedClients }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getInvoices() {
    try {
        const { data, error } = await supabase
            .from("invoices")
            .select(`
                *,
                clients (name, company_name)
            `)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Payments & Invoice Actions ---

export async function getPayments() {
    try {
        const { data, error } = await supabase
            .from("invoice_payments")
            .select(`
                *,
                invoices (
                    invoice_number,
                    clients (name)
                )
            `)
            .order("payment_date", { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function markInvoiceAsPaid(invoiceId: string, grandTotal: number, paymentMethod: string) {
    try {
        // 1. Record Payment
        const { error: paymentError } = await supabase.from("invoice_payments").insert({
            invoice_id: invoiceId,
            amount: grandTotal,
            payment_date: new Date().toISOString(),
            payment_method: paymentMethod,
            notes: "Auto-generated via Mark as Paid"
        });

        if (paymentError) throw paymentError;

        // 2. Update Invoice Status
        const { error: invoiceError } = await supabase
            .from("invoices")
            .update({
                status: 'Paid',
                amount_paid: grandTotal,
                // balance_due is generated/stored, we assume DB handles it or we ignore distinct update if triggered
            })
            .eq("id", invoiceId);

        if (invoiceError) throw invoiceError;

        revalidatePath("/admin/invoices");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function markInvoiceSentToCA(invoiceId: string) {
    try {
        const { error } = await supabase
            .from("invoices")
            .update({ sent_to_ca_at: new Date().toISOString() })
            .eq("id", invoiceId)

        if (error) throw error

        revalidatePath("/admin/invoices")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteInvoice(id: string) {
    try {
        // Cascades to items and payments automatically if schema is defined with ON DELETE CASCADE
        const { error } = await supabase.from("invoices").delete().eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/invoices");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePayment(id: string) {
    try {
        // 1. Get Payment Details to find Invoice
        const { data: payment, error: fetchError } = await supabase
            .from("invoice_payments")
            .select("invoice_id, amount")
            .eq("id", id)
            .single()

        if (fetchError) throw fetchError

        // 2. Delete Payment
        const { error } = await supabase.from("invoice_payments").delete().eq("id", id)
        if (error) throw error

        // 3. Recalculate Invoice Paid Amount
        const { data: payments } = await supabase
            .from("invoice_payments")
            .select("amount")
            .eq("invoice_id", payment.invoice_id)

        const totalPaid = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0

        // 4. Update Invoice Status
        const { data: invoice } = await supabase
            .from("invoices")
            .select("grand_total")
            .eq("id", payment.invoice_id)
            .single()

        // If totalPaid is less than grand_total (minus a small epsilon for floats), marks as Sent (or whatever previous status was, but Sent is safe)
        // If totalPaid is 0, arguably still Sent (or Draft? sticky issue. Sent is safer).
        // If totalPaid >= grand_total, remain Paid.

        let newStatus = 'Sent'
        const grandTotal = Number(invoice?.grand_total) || 0

        if (totalPaid >= grandTotal - 0.5) {
            newStatus = 'Paid'
        }

        await supabase
            .from("invoices")
            .update({
                amount_paid: totalPaid,
                status: newStatus
            })
            .eq("id", payment.invoice_id)

        revalidatePath("/admin/invoices");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getInvoice(id: string) {
    try {
        const { data, error } = await supabase
            .from("invoices")
            .select(`
                *,
                clients (*),
                invoice_items (*)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
// --- Module 8: Subscriptions ---

export async function getSubscriptions() {
    try {
        const { data, error } = await supabase
            .from("subscriptions")
            .select(`
                *,
                clients (name, company_name)
            `)
            .order("created_at", { ascending: false })

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function createSubscription(data: any) {
    try {
        const payload = {
            ...data,
            status: 'Active',
            created_at: new Date().toISOString()
        }

        const { error } = await supabase.from("subscriptions").insert(payload)
        if (error) throw error

        revalidatePath("/admin/subscriptions")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteSubscription(id: string) {
    try {
        const { error } = await supabase.from("subscriptions").delete().eq("id", id)
        if (error) throw error
        revalidatePath("/admin/subscriptions")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function generateInvoiceFromSubscription(subscriptionId: string) {
    try {
        // 1. Get Subscription Details
        const { data: sub, error: subError } = await supabase
            .from("subscriptions")
            .select(`*, clients(*)`)
            .eq("id", subscriptionId)
            .single()

        if (subError) throw subError

        // 2. Prepare Invoice Data
        const { nextNumber, profile } = await getNextInvoiceData()
        // @ts-ignore
        if (!nextNumber) throw new Error("Could not generate invoice number")

        const gstRate = sub.gst_rate || 18
        const amount = Number(sub.monthly_rate) || 0
        const isInterState = sub.clients?.state !== profile?.owner_state

        // Calculate Tax
        const { calculateGST } = require("@/lib/invoice-utils") // Dynamic import to avoid circular dep if any
        const taxes = calculateGST(amount, gstRate, isInterState)
        const grandTotal = amount + taxes.totalTax

        const invoicePayload = {
            invoice_number: nextNumber,
            date: new Date().toISOString(),
            due_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Due in 7 days
            client_id: sub.client_id,
            status: "Draft",
            invoice_category: "Subscription Invoice",
            subtotal: amount,
            gst_rate: gstRate,
            gst_total: taxes.totalTax,
            grand_total: grandTotal,
            notes: `Monthly subscription for ${sub.service_name}`,
            terms: "Payment due on receipt."
        }

        const items = [{
            service_name: sub.service_name,
            description: `Monthly Subscription - ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
            quantity: 1,
            rate: amount
        }]

        // 3. Create Invoice
        const res = await createInvoice(invoicePayload, items)

        if (res.success) {
            // Update last_invoice_date
            await supabase
                .from("subscriptions")
                .update({ last_invoice_date: new Date().toISOString() })
                .eq("id", subscriptionId)

            return { success: true, invoiceId: res.invoiceId }
        } else {
            throw new Error(res.error)
        }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// --- Module 9: Advanced Analytics ---

export async function getAdvancedStats() {
    try {
        // 1. Fetch Business Profile (for State)
        const { data: profile } = await supabase.from("business_profile").select("*").single()
        const businessState = profile?.owner_state || ""

        // 2. Fetch Invoices with Client details
        const { data: invoices, error: invError } = await supabase
            .from("invoices")
            .select(`
                grand_total,
                gst_total,
                created_at,
                status,
                invoice_category,
                client_id,
                clients (id, name, state)
            `)

        if (invError) throw invError

        // 3. Fetch Active Subscriptions for MRR
        const { data: subscriptions, error: subError } = await supabase
            .from("subscriptions")
            .select("monthly_rate")
            .eq("status", "Active")

        if (subError) throw subError

        // --- Calculation Logic ---

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        let revenue = {
            total: 0,
            subscription: 0,
            oneTime: 0,
            net: 0
        }

        let gst = {
            total: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            pending: 0
        }

        let clientsMap = new Set<string>()
        let newClientsThisMonth = 0
        let returningClients = 0
        let clientInvoiceCounts: Record<string, number> = {}

        invoices?.forEach(inv => {
            if (inv.status === 'Paid') {
                const amount = Number(inv.grand_total) || 0
                const tax = Number(inv.gst_total) || 0
                // @ts-ignore
                const category = inv.invoice_category || 'One-Time Service'
                const net = amount - tax

                // Revenue Split
                revenue.total += amount
                revenue.net += net
                if (category.toLowerCase().includes('subscription')) {
                    revenue.subscription += amount
                } else {
                    revenue.oneTime += amount
                }

                // GST Split
                // @ts-ignore
                const clientState = inv.clients?.state || ""
                const isInterState = clientState !== businessState && clientState !== "" && businessState !== ""

                gst.total += tax
                if (isInterState) {
                    gst.igst += tax
                } else {
                    gst.cgst += tax / 2
                    gst.sgst += tax / 2
                }

            } else if (inv.status !== 'Paid') {
                // Pending GST Liability (on Unpaid/Sent invoices, liability technically arises on invoice date usually)
                // For simplified view, we track 'Paid GST' vs 'Pending Collection'
                gst.pending += Number(inv.gst_total) || 0
            }

            // Client Logic (All invoices, not just paid)
            if (inv.client_id) {
                clientsMap.add(inv.client_id)
                clientInvoiceCounts[inv.client_id] = (clientInvoiceCounts[inv.client_id] || 0) + 1
            }
        })

        // Retention & New Clients
        const { data: allClients } = await supabase.from("clients").select("id, created_at")

        allClients?.forEach(c => {
            const created = new Date(c.created_at)
            if (created >= startOfMonth) newClientsThisMonth++
        })

        Object.values(clientInvoiceCounts).forEach(count => {
            if (count > 1) returningClients++
        })

        // MRR
        const mrr = subscriptions?.reduce((sum, sub) => sum + (Number(sub.monthly_rate) || 0), 0) || 0

        return {
            success: true,
            revenue,
            gst,
            mrr,
            clients: {
                total: allClients?.length || 0,
                newThisMonth: newClientsThisMonth,
                returning: returningClients,
                retentionRate: allClients?.length ? ((returningClients / allClients.length) * 100).toFixed(1) : 0
            }
        }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// --- Module 10: Reports ---

export async function generateReportData(dateRange: { from: Date, to: Date }) {
    try {
        const from = new Date(dateRange.from)
        const to = new Date(dateRange.to)
        // Adjust to end of day
        to.setHours(23, 59, 59, 999)

        // 1. Fetch Business Profile
        const { data: profile } = await supabase.from("business_profile").select("*").single()
        const businessState = profile?.owner_state || ""

        // 2. Fetch Invoices in Range
        const { data: invoices, error: invError } = await supabase
            .from("invoices")
            .select(`
                *,
                clients (name, company_name, state, email)
            `)
            .gte('created_at', from.toISOString())
            .lte('created_at', to.toISOString())
            .order('created_at', { ascending: true })

        if (invError) throw invError

        // 3. Process Data
        let totalRevenue = 0
        let totalGST = 0
        let gstBreakdown = { cgst: 0, sgst: 0, igst: 0 }
        let clientStats: Record<string, any> = {}

        invoices?.forEach(inv => {
            if (inv.status === 'Paid') {
                const amount = Number(inv.grand_total) || 0
                const tax = Number(inv.gst_total) || 0
                totalRevenue += amount
                totalGST += tax

                // GST Split
                // @ts-ignore
                const clientState = inv.clients?.state || ""
                const isInterState = clientState !== businessState && clientState !== "" && businessState !== ""

                if (isInterState) {
                    gstBreakdown.igst += tax
                } else {
                    gstBreakdown.cgst += tax / 2
                    gstBreakdown.sgst += tax / 2
                }
            }

            // Client Stats
            // @ts-ignore
            const clientName = inv.clients?.company_name || inv.clients?.name
            if (clientName) {
                if (!clientStats[clientName]) {
                    clientStats[clientName] = {
                        name: clientName,
                        total: 0,
                        count: 0,
                        // @ts-ignore
                        email: inv.clients?.email
                    }
                }
                if (inv.status === 'Paid') {
                    clientStats[clientName].total += Number(inv.grand_total) || 0
                }
                clientStats[clientName].count++
            }
        })

        const topClients = Object.values(clientStats)
            .sort((a: any, b: any) => b.total - a.total)
            .slice(0, 10)

        // 4. Payment Modes (Mocking for now as we don't strictly link payments to date ranges of invoices easily without more querying)
        const { data: payments } = await supabase
            .from("invoice_payments")
            .select("amount, payment_method")
            .gte('payment_date', from.toISOString())
            .lte('payment_date', to.toISOString())

        let paymentMethods: Record<string, number> = {}
        payments?.forEach(p => {
            paymentMethods[p.payment_method] = (paymentMethods[p.payment_method] || 0) + (Number(p.amount) || 0)
        })


        return {
            success: true,
            period: { from, to },
            profile,
            summary: {
                revenue: totalRevenue,
                gst: totalGST,
                invoicesCount: invoices?.length || 0,
                paidCount: invoices?.filter(i => i.status === 'Paid').length || 0
            },
            gst: gstBreakdown,
            clients: topClients,
            paymentMethods,
            invoices: invoices // Passing detailed list for the table
        }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// --- Module 11: Service Agreements ---

export async function getAgreements() {
    try {
        const { data, error } = await supabase
            .from("agreements")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getAgreement(id: string) {
    try {
        const { data, error } = await supabase
            .from("agreements")
            .select("*")
            .eq("id", id)
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function saveAgreement(agreementData: any) {
    try {
        const payload = {
            ...agreementData,
            updated_at: new Date().toISOString()
        }

        if (!payload.created_at) {
            payload.created_at = new Date().toISOString()
        }

        const { data, error } = await supabase
            .from("agreements")
            .upsert(payload)
            .select()
            .single()

        if (error) throw error

        revalidatePath("/admin/agreements")
        revalidatePath(`/admin/agreements/${data.id}`)
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteAgreement(id: string) {
    try {
        const { error } = await supabase.from("agreements").delete().eq("id", id)
        if (error) throw error
        revalidatePath("/admin/agreements")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
