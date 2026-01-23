"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, BarChart } from "lucide-react"
import { AnalyticsStats, updateAnalyticsStats } from "@/actions/analytics-actions"
import { useRouter } from "next/navigation"

export function AnalyticsEditor({ initialStats }: { initialStats: AnalyticsStats }) {
    const [isLoading, setIsLoading] = useState(false)
    const [stats, setStats] = useState(initialStats)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        await updateAnalyticsStats(stats)
        setIsLoading(false)
        router.refresh()
        alert("Dashboard Stats Updated!")
    }

    const handleChange = (key: keyof AnalyticsStats, value: string) => {
        setStats(prev => ({ ...prev, [key]: value }))
    }

    return (
        <Card className="border-white/10 bg-white/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Manual Dashboard Stats
                </CardTitle>
                <CardDescription>
                    Manually update the numbers shown on the main dashboard if not connected to a live API.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Views */}
                        <div className="space-y-4 rounded-lg border border-white/10 p-4">
                            <h4 className="font-semibold text-muted-foreground">Total Views</h4>
                            <div className="space-y-2">
                                <Label>Count</Label>
                                <Input value={stats.views} onChange={(e) => handleChange('views', e.target.value)} className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtitle (Trend)</Label>
                                <Input value={stats.viewsSub} onChange={(e) => handleChange('viewsSub', e.target.value)} className="bg-background/50" />
                            </div>
                        </div>

                        {/* Leads */}
                        <div className="space-y-4 rounded-lg border border-white/10 p-4">
                            <h4 className="font-semibold text-muted-foreground">Active Leads</h4>
                            <div className="space-y-2">
                                <Label>Count</Label>
                                <Input value={stats.leads} onChange={(e) => handleChange('leads', e.target.value)} className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtitle (Trend)</Label>
                                <Input value={stats.leadsSub} onChange={(e) => handleChange('leadsSub', e.target.value)} className="bg-background/50" />
                            </div>
                        </div>

                        {/* Engagement */}
                        <div className="space-y-4 rounded-lg border border-white/10 p-4">
                            <h4 className="font-semibold text-muted-foreground">Engagement Rate</h4>
                            <div className="space-y-2">
                                <Label>Count</Label>
                                <Input value={stats.engagement} onChange={(e) => handleChange('engagement', e.target.value)} className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtitle (Trend)</Label>
                                <Input value={stats.engagementSub} onChange={(e) => handleChange('engagementSub', e.target.value)} className="bg-background/50" />
                            </div>
                        </div>

                        {/* Bounce Rate */}
                        <div className="space-y-4 rounded-lg border border-white/10 p-4">
                            <h4 className="font-semibold text-muted-foreground">Bounce Rate</h4>
                            <div className="space-y-2">
                                <Label>Count</Label>
                                <Input value={stats.bounce} onChange={(e) => handleChange('bounce', e.target.value)} className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtitle (Trend)</Label>
                                <Input value={stats.bounceSub} onChange={(e) => handleChange('bounceSub', e.target.value)} className="bg-background/50" />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Update Dashboard Numbers
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
