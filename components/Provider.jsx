"use client"

import { SessionProvider } from "next-auth/react"

export default function Provider ({children}) {
    return (
        <div>
            <SessionProvider>
                {children}
            </SessionProvider>
        </div>
    )
}