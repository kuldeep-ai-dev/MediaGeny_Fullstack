"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getPendingInquiryCount } from "@/actions/appointment-actions"

export function InquiryBadge() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        // Initial fetch
        fetchCount()

        // Poll every 30 seconds to keep it updated without reload
        const interval = setInterval(fetchCount, 30000)
        return () => clearInterval(interval)
    }, [])

    async function fetchCount() {
        const c = await getPendingInquiryCount()
        setCount(c)
    }

    if (count === 0) return null

    return (
        <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
            {count > 99 ? "99+" : count}
        </Badge>
    )
}
