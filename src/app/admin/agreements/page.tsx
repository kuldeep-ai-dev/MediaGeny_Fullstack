import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, FileText, Trash2, Eye, Printer } from "lucide-react"
import Link from "next/link"
import { getAgreements } from "@/actions/invoice-actions"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function AgreementsDashboard() {
    const res = await getAgreements()
    const agreements = res.success ? res.data : []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Service Agreements</h1>
                    <p className="text-muted-foreground mt-2">Manage and view all onboarded client agreements.</p>
                </div>
                <Link href="/admin/agreements/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Onboard New Client
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Agreements</CardTitle>
                    <CardDescription>A list of clients onboarded with signed service agreements.</CardDescription>
                </CardHeader>
                <CardContent>
                    {agreements && agreements.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Client Name</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Representative</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agreements.map((item: any) => (
                                    <TableRow key={item.id} className="h-20 sm:h-24 transition-colors hover:bg-muted/50">
                                        <TableCell className="text-sm sm:text-base">{new Date(item.agreement_date).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold text-base sm:text-lg">{item.client_name}</TableCell>
                                        <TableCell className="text-sm sm:text-base text-muted-foreground">{item.client_company || "N/A"}</TableCell>
                                        <TableCell className="hidden md:table-cell text-sm">{item.representative_name}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/agreements/${item.id}`}>
                                                <Button variant="secondary" size="lg" className="h-12 px-6 shadow-sm">
                                                    <Eye className="h-5 w-5 mr-3" /> View Detail
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                            <FileText className="h-10 w-10 mb-2 opacity-20" />
                            <p>No agreements found. Start by onboarding a client.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
