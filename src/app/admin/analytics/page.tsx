import { getAdvancedStats } from "@/actions/invoice-actions"
import { getAnalyticsStats, getAnalyticsConfig } from "@/actions/analytics-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/invoice-utils"
import { ArrowUpRight, DollarSign, Users, CreditCard, Receipt, Activity, TrendingUp } from "lucide-react"
import { AnalyticsConfigForm } from "@/components/admin/AnalyticsConfigForm"

export default async function AnalyticsPage() {
    const { success, revenue, gst, mrr, clients } = await getAdvancedStats()
    const finalStats = await getAnalyticsStats()
    const config = await getAnalyticsConfig()

    // Fallback if data fetch fails
    if (!success) {
        return <div className="p-10 text-red-500">Failed to load analytics data. Check DB schema.</div>
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Business Overview</TabsTrigger>
                    {/* Manual Stats Removed as per request */}
                    <TabsTrigger value="integration">Integrations</TabsTrigger>
                    <TabsTrigger value="clients">Client Insights</TabsTrigger>
                    <TabsTrigger value="gst">GST Analysis</TabsTrigger>
                </TabsList>

                {/* --- INTEGRATION TAB --- */}
                <TabsContent value="integration" className="space-y-4">
                    <AnalyticsConfigForm initialConfig={config} />
                </TabsContent>

                {/* --- OVERVIEW TAB --- */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(revenue?.total || 0)}</div>
                                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">MRR</CardTitle>
                                <Activity className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(mrr || 0)}</div>
                                <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(revenue?.net || 0)}</div>
                                <p className="text-xs text-muted-foreground">Excluding Taxes</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                                <Receipt className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(revenue?.subscription || 0)}</div>
                                <p className="text-xs text-muted-foreground">Revenue from Plans</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- CLIENTS TAB --- */}
                <TabsContent value="clients" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{clients?.total || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                                <Users className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{clients?.newThisMonth || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Returning Clients</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{clients?.returning || 0}</div>
                                <p className="text-xs text-muted-foreground">{">"} 1 Paid Invoice</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                                <Activity className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{clients?.retentionRate}%</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- GST TAB --- */}
                <TabsContent value="gst" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total GST Collected</CardTitle>
                                <DollarSign className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(gst?.total || 0)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">CGST (Central)</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(gst?.cgst || 0)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">SGST (State)</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(gst?.sgst || 0)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">IGST (Inter-State)</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(gst?.igst || 0)}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-yellow-600">Pending Liability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{formatCurrency(gst?.pending || 0)}</div>
                            <p className="text-xs text-muted-foreground">GST on Unpaid/Overdue Invoices</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
