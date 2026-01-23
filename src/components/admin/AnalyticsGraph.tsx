"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AnalyticsGraphProps {
    data: { date: string, views: number }[]
}

export function AnalyticsGraph({ data }: AnalyticsGraphProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="border-white/10 bg-white/5">
                <CardHeader>
                    <CardTitle>Analytics Overview</CardTitle>
                    <CardDescription>
                        No data available yet. Please connect Google Analytics.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Waiting for data...
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-white/10 bg-white/5">
            <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
                <CardDescription>
                    Daily views for the past 30 days.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => {
                                    // format YYYY-MM-DD to MM/DD
                                    if (typeof val === 'string' && val.includes('-')) {
                                        const parts = val.split('-')
                                        return `${parts[1]}/${parts[2]}`
                                    }
                                    return val
                                }}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', color: '#fff' }}
                            />
                            <Bar
                                dataKey="views"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-primary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
