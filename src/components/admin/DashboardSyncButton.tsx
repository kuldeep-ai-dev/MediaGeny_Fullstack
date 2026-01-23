"use client"

import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DashboardSyncButton() {
    const router = useRouter()
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = () => {
        setIsSyncing(true)
        router.refresh()
        setTimeout(() => setIsSyncing(false), 2000) // Simulate refresh/min wait
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="border-white/10 hover:bg-white/10 transition-all"
        >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Data"}
        </Button>
    )
}
