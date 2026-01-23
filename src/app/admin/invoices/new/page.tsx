
import { getClients, getNextInvoiceData } from "@/actions/invoice-actions";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { AlertCircle } from "lucide-react";

export default async function NewInvoicePage() {
    const [clientsRes, metaRes] = await Promise.all([
        getClients(),
        getNextInvoiceData(),
    ]);

    if (!metaRes.success || !metaRes.profile) {
        return (
            <div className="p-6">
                <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="h-5 w-5" />
                    <div>
                        <h3 className="font-semibold">Business Profile Missing</h3>
                        <p>Please configure your business profile settings before creating an invoice.</p>
                    </div>
                </div>
            </div>
        );
    }

    const clients = (clientsRes.success && clientsRes.data) ? clientsRes.data : [];
    const nextNumber = metaRes.nextNumber || "";
    const businessProfile = metaRes.profile;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Create New Invoice</h2>
            </div>
            <div className="border p-6 rounded-lg bg-card text-card-foreground shadow-sm">
                <InvoiceForm
                    clients={clients}
                    nextNumber={nextNumber}
                    businessProfile={businessProfile}
                />
            </div>
        </div>
    );
}
