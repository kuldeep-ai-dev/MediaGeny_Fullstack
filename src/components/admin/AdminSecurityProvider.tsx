"use client"

import { useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/auth-actions"

// 15 Minutes
const TIMEOUT_MS = 15 * 60 * 1000

export function AdminSecurityProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    let timer: NodeJS.Timeout

    const resetTimer = useCallback(() => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(async () => {
            // Logout action
            // Note: Since 'logout' is a server action that redirects, 
            // calling it here might need to be wrapped or we can just push to login
            // But strict security means clearing the cookie on server.
            await logout()
        }, TIMEOUT_MS)
    }, [])

    // Use refs to avoid re-render loops on timer updates
    const lastActivityRef = useRef<number>(Date.now())

    // Update shared activity timestamp
    const updateActivity = useCallback(() => {
        const now = Date.now()
        lastActivityRef.current = now
        localStorage.setItem("admin_last_activity", now.toString())
    }, [])

    useEffect(() => {
        // 1. Strict Tab Isolation: Check for session lock
        const sessionLock = sessionStorage.getItem("admin_session_lock")
        if (!sessionLock) {
            logout()
            return
        }

        // 2. Setup Activity Listeners
        const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"]
        // Throttle slightly if needed, but direct call is fine for low frequency inputs
        const handleActivity = () => updateActivity()

        events.forEach(event => window.addEventListener(event, handleActivity))

        // 3. Setup Interval Check (Shared Timer Loop)
        const intervalId = setInterval(async () => {
            const storedLastActivity = localStorage.getItem("admin_last_activity")
            const lastActivityTime = storedLastActivity ? parseInt(storedLastActivity) : lastActivityRef.current
            const now = Date.now()

            if (now - lastActivityTime > TIMEOUT_MS) {
                // Time up!
                await logout()
            }
        }, 10000) // Check every 10s

        // Init
        updateActivity()

        // Cleanup
        return () => {
            clearInterval(intervalId)
            events.forEach(event => window.removeEventListener(event, handleActivity))
        }
    }, [updateActivity])

    return <>{children}</>
}
