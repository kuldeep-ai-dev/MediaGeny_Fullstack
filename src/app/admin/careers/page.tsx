"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Briefcase, FileText, Trash2, Edit, Eye, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getAllJobs, getApplications, deleteJob, updateApplicationStatus, deleteApplication, Job, Application } from "@/actions/career-actions"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export default function AdminCareersPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [applications, setApplications] = useState<Application[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setIsLoading(true)
        const [jobsData, appsData] = await Promise.all([
            getAllJobs(),
            getApplications()
        ])
        setJobs(jobsData)
        setApplications(appsData)
        setIsLoading(false)
    }

    async function handleDeleteJob(id: string) {
        if (!confirm("Are you sure you want to delete this job?")) return
        await deleteJob(id)
        loadData()
    }

    async function handleDeleteApplication(id: string) {
        if (!confirm("Are you sure you want to delete this application? This cannot be undone.")) return
        await deleteApplication(id)
        loadData()
    }

    async function handleStatusUpdate(id: string, newStatus: string) {
        await updateApplicationStatus(id, newStatus)
        loadData()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Careers & Recruitment</h2>
                    <p className="text-muted-foreground">Manage job postings and view candidate applications.</p>
                </div>
                <Link href="/admin/careers/new">
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                        <Plus className="mr-2 h-4 w-4" /> Post New Job
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="jobs" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="jobs">Job Postings</TabsTrigger>
                    <TabsTrigger value="applications">Role Applications</TabsTrigger>
                    <TabsTrigger value="talent-pool">Talent Pool</TabsTrigger>
                </TabsList>

                <TabsContent value="jobs">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Active Job Openings</CardTitle>
                            <CardDescription>Manage your current job listings and internships.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Posted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading jobs...</TableCell>
                                        </TableRow>
                                    ) : jobs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No jobs posted yet.</TableCell>
                                        </TableRow>
                                    ) : (
                                        jobs.map((job) => (
                                            <TableRow key={job.id}>
                                                <TableCell className="font-medium">{job.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant={job.type === "internship" ? "secondary" : "default"}>
                                                        {job.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{job.department}</TableCell>
                                                <TableCell>{job.location}</TableCell>
                                                <TableCell>{format(new Date(job.created_at), 'MMM d, yyyy')}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/careers/${job.id}`)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteJob(job.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="applications">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Role Applications</CardTitle>
                            <CardDescription>Applications for specific job postings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ApplicantsTable
                                apps={applications.filter(a => a.job_id)}
                                isLoading={isLoading}
                                onStatusUpdate={handleStatusUpdate}
                                onDelete={handleDeleteApplication}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="talent-pool">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Talent Pool</CardTitle>
                            <CardDescription>General applications for future opportunities.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ApplicantsTable
                                apps={applications.filter(a => !a.job_id)}
                                isLoading={isLoading}
                                onStatusUpdate={handleStatusUpdate}
                                onDelete={handleDeleteApplication}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function ApplicantsTable({ apps, isLoading, onStatusUpdate, onDelete }: {
    apps: Application[],
    isLoading: boolean,
    onStatusUpdate: (id: string, status: string) => void,
    onDelete: (id: string) => void
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading applications...</TableCell>
                    </TableRow>
                ) : apps.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No applications found.</TableCell>
                    </TableRow>
                ) : (
                    apps.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.candidate_name}</TableCell>
                            <TableCell>{app.jobs?.title || <span className="text-muted-foreground italic">General Application</span>}</TableCell>
                            <TableCell>{app.email}</TableCell>
                            <TableCell>{format(new Date(app.created_at), 'MMM d')}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        app.status === 'hired' ? 'border-green-500 text-green-500' :
                                            app.status === 'rejected' ? 'border-red-500 text-red-500' :
                                                app.status === 'interviewing' ? 'border-yellow-500 text-yellow-500' : ''
                                    }
                                >
                                    {app.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {app.resume_url && (
                                    <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                        <FileText className="h-3 w-3" /> View
                                    </a>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title="Mark as Interviewing"
                                        onClick={() => onStatusUpdate(app.id, 'interviewing')}
                                    >
                                        <Eye className="h-4 w-4 text-yellow-400" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title="Reject"
                                        onClick={() => onStatusUpdate(app.id, 'rejected')}
                                    >
                                        <XCircle className="h-4 w-4 text-red-400" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title="Delete Application"
                                        className="text-muted-foreground hover:text-red-500"
                                        onClick={() => onDelete(app.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
