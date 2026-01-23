
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, Users, FileText, Receipt, Trash2, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"
import { getInvoiceStats, getInvoices, getPayments, deletePayment, getBusinessProfile } from "@/actions/invoice-actions"
import { formatCurrency } from "@/lib/invoice-utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceActions } from "@/components/invoice/InvoiceActions"
import { DeletePaymentButton } from "@/components/invoice/DeletePaymentButton"

export default async function InvoicesDashboard() {
    const [statsRes, invoicesRes, paymentsRes, profileRes] = await Promise.all([
        getInvoiceStats(),
        getInvoices(),
        getPayments(),
        getBusinessProfile()
    ]);

    const clientCount = statsRes.success ? statsRes.clientCount : 0;
    const revenue = (statsRes.success && statsRes.revenue) || { total: 0, week: 0, month: 0, year: 0 };
    const invoices = invoicesRes.success ? invoicesRes.data : [];
    const payments = paymentsRes.success ? paymentsRes.data : [];
    const profile = profileRes.success ? profileRes.data : null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-muted-foreground mt-2">Manage your billing, payments, and clients.</p>
                </div>
                <Link href="/admin/invoices/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Invoice
                    </Button>
                </Link>
            </div>

            {/* Analytics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(revenue.week)}</div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(revenue.month)}</div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Year</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(revenue.year)}</div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Lifetime</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(revenue.total)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime Revenue</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientCount}</div>
                        <Link href="/admin/invoices/clients" className="mt-4 block">
                            <Button variant="outline" size="sm" className="w-full">Manage Clients</Button>
                        </Link>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Settings</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Profile</div>
                        <Link href="/admin/invoices/settings" className="mt-4 block">
                            <Button variant="outline" size="sm" className="w-full">Edit Settings</Button>
                        </Link>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payments</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payments?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Recorded Transactions</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="invoices" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>

                <TabsContent value="invoices" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Invoices</CardTitle>
                            <CardDescription>A list of your recent invoices.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {invoices && invoices.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((inv: any) => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                                                <TableCell>
                                                    {inv.clients?.company_name || inv.clients?.name || "N/A"}
                                                </TableCell>
                                                <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{formatCurrency(inv.grand_total)}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${inv.status === 'Paid' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'text-foreground'}`}>
                                                        {inv.status}
                                                    </span>
                                                    {inv.sent_to_ca_at && (
                                                        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                            CA: Sent
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <InvoiceActions invoice={inv} caEmail={profile?.ca_email} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                                    <Receipt className="h-10 w-10 mb-2 opacity-20" />
                                    <p>No invoices generated yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                            <CardDescription>Track all payments received.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {payments && payments.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.map((pay: any) => (
                                            <TableRow key={pay.id}>
                                                <TableCell>{new Date(pay.payment_date).toLocaleDateString()}</TableCell>
                                                <TableCell className="font-medium">
                                                    {pay.invoices?.invoice_number || "Deleted Invoice"}
                                                </TableCell>
                                                <TableCell>
                                                    {pay.invoices?.clients?.name || "N/A"}
                                                </TableCell>
                                                <TableCell>{pay.payment_method || "N/A"}</TableCell>
                                                <TableCell>{formatCurrency(pay.amount)}</TableCell>
                                                <TableCell className="text-right">
                                                    {/* We need a Client Component for Delete because of interactivity. 
                                                         For now, I'll place a placeholder button or use a server action form if simple enough.
                                                         Ideally, this row should be a client component.
                                                      */}
                                                    <DeletePaymentButton paymentId={pay.id} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                                    <CreditCard className="h-10 w-10 mb-2 opacity-20" />
                                    <p>No payments recorded yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    )
}
