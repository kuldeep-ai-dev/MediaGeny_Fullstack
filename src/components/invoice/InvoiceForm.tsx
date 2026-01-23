"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Trash2, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { calculateGST, formatCurrency } from "@/lib/invoice-utils"
import { createInvoice } from "@/actions/invoice-actions"
import { toast } from "sonner" // Assuming sonner or use-toast is available, sticking to console/alert if not

const invoiceSchema = z.object({
    invoice_number: z.string().min(1, "Invoice Number is required"),
    date: z.date(),
    due_date: z.date().optional(),
    client_id: z.string().min(1, "Client is required"),
    items: z.array(
        z.object({
            service_name: z.string().min(1, "Service Name is required"),
            description: z.string().optional(),
            quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
            rate: z.coerce.number().min(0, "Rate must be positive"),
        })
    ).min(1, "At least one item is required"),
    notes: z.string().optional(),
    terms: z.string().optional(),
})

type InvoiceFormValues = z.infer<typeof invoiceSchema>

interface Client {
    id: string
    name: string
    company_name: string | null
    state: string
    gst_number: string | null
}

interface InvoiceFormProps {
    clients: Client[]
    nextNumber: string
    businessProfile: any
}

export function InvoiceForm({ clients, nextNumber, businessProfile }: InvoiceFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    // Calculations State
    const [totals, setTotals] = useState({
        subtotal: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        gstTotal: 0,
        grandTotal: 0,
        isInterState: false
    })

    const defaultTerms = "Payment due within 15 days. \nPlease include invoice number on your check."

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: {
            invoice_number: nextNumber,
            date: new Date(),
            items: [{ service_name: "", description: "", quantity: 1, rate: 0 }],
            notes: "",
            terms: defaultTerms,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    })

    // Watch for changes to calculate totals
    const watchedItems = form.watch("items")
    const selectedClientId = form.watch("client_id")

    useEffect(() => {
        const client = clients.find(c => c.id === selectedClientId)
        const isInterState = client?.state !== businessProfile?.owner_state

        let subtotal = 0
        watchedItems.forEach(item => {
            const qty = Number(item.quantity) || 0
            const rate = Number(item.rate) || 0
            subtotal += qty * rate
        })

        const gstRate = Number(businessProfile?.default_gst_rate) || 18
        const taxes = calculateGST(subtotal, gstRate, isInterState)

        setTotals({
            subtotal,
            cgst: taxes.cgst,
            sgst: taxes.sgst,
            igst: taxes.igst,
            gstTotal: taxes.totalTax,
            grandTotal: subtotal + taxes.totalTax,
            isInterState
        })

    }, [watchedItems, selectedClientId, businessProfile, clients])

    async function onSubmit(data: InvoiceFormValues) {
        setIsPending(true)
        try {
            const payload = {
                invoice_number: data.invoice_number,
                date: data.date,
                due_date: data.due_date,
                client_id: data.client_id,
                status: "Draft", // Default status
                invoice_type: "Tax Invoice",
                subtotal: totals.subtotal,
                gst_rate: Number(businessProfile?.default_gst_rate) || 18,
                gst_total: totals.gstTotal,
                grand_total: totals.grandTotal,
                notes: data.notes,
                terms: data.terms,
            }

            const res = await createInvoice(payload, data.items)
            if (res.success) {
                // toast.success("Invoice created successfully")
                router.push("/admin/invoices")
            } else {
                alert("Error: " + res.error)
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="invoice_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Invoice Number</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Invoice Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="due_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Due Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Client Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="client_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a client" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.name} {client.company_name ? `(${client.company_name})` : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Display Client Meta */}
                    {selectedClientId && (
                        <div className="text-sm border p-4 rounded-md bg-muted/50">
                            <p className="font-semibold text-muted-foreground">Client Details:</p>
                            {(() => {
                                const c = clients.find(cl => cl.id === selectedClientId)
                                if (!c) return null;
                                return (
                                    <div className="mt-2 space-y-1">
                                        <p>{c.company_name}</p>
                                        <p>State: {c.state} {totals.isInterState ? "(Inter-state: IGST Applies)" : "(Intra-state: CGST+SGST Applies)"}</p>
                                        <p>GST: {c.gst_number || "N/A"}</p>
                                    </div>
                                )
                            })()}
                        </div>
                    )}
                </div>

                {/* Line Items */}
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Service / Item</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px]">Qty</TableHead>
                                <TableHead className="w-[150px]">Rate</TableHead>
                                <TableHead className="w-[150px] text-right">Amount</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => {
                                const qty = form.watch(`items.${index}.quantity`) || 0
                                const rate = form.watch(`items.${index}.rate`) || 0
                                const amount = qty * rate

                                return (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.service_name`}
                                                render={({ field }) => <Input {...field} placeholder="Service Name" />}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.description`}
                                                render={({ field }) => <Input {...field} placeholder="Description" />}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({ field }) => <Input type="number" min="1" {...field} />}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.rate`}
                                                render={({ field }) => <Input type="number" min="0" {...field} />}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right align-middle font-medium">
                                            {formatCurrency(amount)}
                                        </TableCell>
                                        <TableCell>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    <div className="p-4 border-t">
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ service_name: "", description: "", quantity: 1, rate: 0 })}>
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="flex justify-end">
                    <div className="w-[300px] space-y-2">
                        <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(totals.subtotal)}</span>
                        </div>

                        {totals.isInterState ? (
                            <div className="flex justify-between py-1 text-sm">
                                <span className="text-muted-foreground">IGST ({businessProfile?.default_gst_rate || 18}%)</span>
                                <span>{formatCurrency(totals.igst)}</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">CGST ({(businessProfile?.default_gst_rate || 18) / 2}%)</span>
                                    <span>{formatCurrency(totals.cgst)}</span>
                                </div>
                                <div className="flex justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">SGST ({(businessProfile?.default_gst_rate || 18) / 2}%)</span>
                                    <span>{formatCurrency(totals.sgst)}</span>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between py-2 border-t font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(totals.grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Thank you for your business..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Terms & Conditions</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending} className="w-[200px]">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Invoice
                    </Button>
                </div>

            </form>
        </Form>
    )
}
