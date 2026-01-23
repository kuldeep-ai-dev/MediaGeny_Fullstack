"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldCheck, User } from "lucide-react"
import { updateAdminCredentials } from "@/actions/auth-actions"

export function AdminSecuritySettings() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const username = formData.get("username") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        if (password && password !== confirmPassword) {
            setMessage({ type: 'error', text: "Passwords do not match." })
            setIsLoading(false)
            return
        }

        if (!username && !password) {
            setMessage({ type: 'error', text: "No changes detected." })
            setIsLoading(false)
            return
        }

        const result = await updateAdminCredentials(username, password)

        if (result.success) {
            setMessage({ type: 'success', text: "Credentials updated successfully. Please re-login." })
            // Optional: Sign out or redirect? For now just show success.
        } else {
            setMessage({ type: 'error', text: result.error || "Failed to update credentials." })
        }

        setIsLoading(false)
    }

    return (
        <div className="grid gap-6">
            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Admin Credentials
                    </CardTitle>
                    <CardDescription>
                        Update your login details. Leave password blank if you only want to change username.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="username">New Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="Enter new username"
                                    className="pl-9 bg-background/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter new password"
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                className="bg-background/50"
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Credentials"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
