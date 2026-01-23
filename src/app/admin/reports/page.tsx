"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, Printer } from "lucide-react"
import { cn } from "@/lib/utils"
// import { DateRange } from "react-day-picker" // Import error common in some setups, we'll try standard way
import { generateReportData } from "@/actions/invoice-actions"
import { ReportTemplate } from "@/components/reports/ReportTemplate"
import { Loader2 } from "lucide-react"

export default function ReportsPage() {
    const [date, setDate] = useState<any | undefined>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days default
        to: new Date()
    })

    const [reportData, setReportData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        if (!date?.from || !date?.to) {
            alert("Please select a date range")
            return
        }

        setLoading(true)
        try {
            const res = await generateReportData({ from: date.from, to: date.to })
            if (res.success) {
                setReportData(res)
            } else {
                alert("Error: " + res.error)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="space-y-6">
            {/* CONTROLS - Hidden when printing */}
            <div className="print:hidden space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reports Generator</h1>
                        <p className="text-muted-foreground">Select a date range to generate a professional PDF report.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-secondary/20 p-4 rounded-lg border">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Report
                    </Button>

                    {reportData && (
                        <Button variant="secondary" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print / Save PDF
                        </Button>
                    )}
                </div>
            </div>

            {/* PREVIEW AREA */}
            <div id="report-print-view" className="min-h-[500px] border rounded-lg bg-gray-50/50 p-8 print:p-0 print:border-none print:bg-white">
                {reportData ? (
                    <ReportTemplate data={reportData} />
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground print:hidden">
                        Select a range and click Generate to view report.
                    </div>
                )}
            </div>
        </div>
    )
}
