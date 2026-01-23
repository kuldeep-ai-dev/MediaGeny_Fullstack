"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { createSubscription } from "@/actions/invoice-actions"
import { Loader2, Plus } from "lucide-react"

const formSchema = z.object({
    client_id: z.string().min(1, "Client is required"),
    service_name: z.string().min(1, "Service name is required"),
    monthly_rate: z.coerce.number().min(1, "Amount must be positive"),
    billing_cycle_day: z.coerce.number().min(1).max(31),
    gst_rate: z.coerce.number().optional().default(18)
})

type SubscriptionFormValues = z.infer<typeof formSchema>

export function CreateSubscriptionModal({ clients }: { clients: any[] }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SubscriptionFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            // @ts-ignore
            service_name: "",
            // @ts-ignore
            monthly_rate: 0,
            // @ts-ignore
            billing_cycle_day: 1,
            // @ts-ignore
            gst_rate: 18
        },
    })

    async function onSubmit(values: SubscriptionFormValues) {
        setLoading(true)
        try {
            const res = await createSubscription(values)
            if (res.success) {
                setOpen(false)
                form.reset()
            } else {
                alert("Error: " + res.error)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Subscription
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Subscription</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <FormField
                            control={form.control}
                            name="service_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. SEO Maintenance" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="monthly_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monthly Rate</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="billing_cycle_day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Billing Day</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" max="31" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Subscription
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
