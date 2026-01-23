import { getPayments } from "@/actions/invoice-actions"
import { DeletePaymentButton } from "@/components/invoice/DeletePaymentButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/invoice-utils"
import Link from "next/link"

export default async function PaymentsPage() {
    const { data: payments, success, error } = await getPayments()

    if (!success) {
        return <div className="p-8 text-red-500">Error loading payments: {error}</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground">Global history of all received payments.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All recorded transactions from invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments?.map((payment: any) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                                    <TableCell>
                                        <Link href={`/admin/invoices/${payment.invoice_id}`} className="hover:underline text-primary">
                                            {payment.invoices?.invoice_number}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{payment.invoices?.clients?.name || "Unknown"}</TableCell>
                                    <TableCell>{payment.payment_method}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(payment.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DeletePaymentButton paymentId={payment.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!payments?.length && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No payments recorded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
