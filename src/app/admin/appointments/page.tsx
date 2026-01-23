"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, CheckCircle, Mail, Phone, Calendar } from "lucide-react"
import { getAppointments, updateAppointmentStatus, deleteAppointment, Appointment } from "@/actions/appointment-actions"
import { format } from "date-fns"

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setIsLoading(true)
        const data = await getAppointments()
        setAppointments(data)
        setIsLoading(false)
    }

    async function handleStatusUpdate(id: string, status: 'pending' | 'contacted' | 'closed') {
        await updateAppointmentStatus(id, status)
        loadData()
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this appointment record?")) return
        await deleteAppointment(id)
        loadData()
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">All Inquiries</h2>
                <p className="text-muted-foreground">Manage incoming service inquiries, product requests, and appointments.</p>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>Inquiries</CardTitle>
                    <CardDescription>{appointments.length} appointment requests found.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading data...</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">No bookings yet.</div>
                    ) : (
                        <div className="rounded-md border border-white/10">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5">
                                        <TableHead>Date</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Service / Details</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map((apt) => (
                                        <TableRow key={apt.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="text-muted-foreground whitespace-nowrap">
                                                {format(new Date(apt.created_at), 'MMM d')}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {apt.inquiry_source || "Unknown"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{apt.name}</div>
                                                <div className="text-xs text-muted-foreground flex flex-col gap-1 mt-1">
                                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {apt.email}</span>
                                                    {apt.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {apt.phone}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium">{apt.inquiry_type || "General"}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{apt.service_type || "-"}</div>
                                                {apt.preferred_date && (
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Calendar className="h-3 w-3" /> {format(new Date(apt.preferred_date), 'MMM d, yyyy')}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    apt.status === 'contacted' ? 'default' :
                                                        apt.status === 'closed' ? 'secondary' : 'destructive'
                                                } className="capitalize">
                                                    {apt.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {apt.status === 'pending' && (
                                                        <Button size="sm" variant="outline" className="h-8" onClick={() => handleStatusUpdate(apt.id, 'contacted')}>
                                                            Mark Contacted
                                                        </Button>
                                                    )}
                                                    {apt.status === 'contacted' && (
                                                        <Button size="sm" variant="outline" className="h-8" onClick={() => handleStatusUpdate(apt.id, 'closed')}>
                                                            Close
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => handleDelete(apt.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
