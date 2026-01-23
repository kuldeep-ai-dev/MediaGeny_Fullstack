"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, Globe } from "lucide-react"
import { saveAnalyticsConfig } from "@/actions/analytics-actions"
import { useRouter } from "next/navigation"

export function AnalyticsConfigForm({ initialConfig }: { initialConfig: { propertyId: string, hasJson: boolean } }) {
    const [isLoading, setIsLoading] = useState(false)
    const [propertyId, setPropertyId] = useState(initialConfig.propertyId)
    const [jsonKey, setJsonKey] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const result = await saveAnalyticsConfig(propertyId, jsonKey)

        setIsLoading(false)
        if (result.success) {
            setJsonKey("") // Clear sensitive field after save
            router.refresh()
            alert("Google Analytics Configuration Saved!")
        } else {
            alert("Error saving configuration: " + result.error)
        }
    }

    return (
        <Card className="border-white/10 bg-white/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    Google Analytics 4 Integration
                </CardTitle>
                <CardDescription>
                    Connect your website to Google Analytics for automatic real-time updates.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>GA4 Property ID</Label>
                        <Input
                            value={propertyId}
                            onChange={(e) => setPropertyId(e.target.value)}
                            placeholder="e.g. 123456789"
                            className="bg-background/50"
                        />
                        <p className="text-xs text-muted-foreground">Found in Admin {'>'} Property Settings {'>'} Property Details</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Service Account JSON Key</Label>
                        <Textarea
                            value={jsonKey}
                            onChange={(e) => setJsonKey(e.target.value)}
                            placeholder={initialConfig.hasJson ? "(Existing key hidden per security)" : "Paste the entire content of the JSON file here..."}
                            className="bg-background/50 font-mono text-xs min-h-[150px]"
                        />
                        <p className="text-xs text-muted-foreground">
                            Create a Service Account in Google Cloud, download the JSON key, and paste it here.
                        </p>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Configuration
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
