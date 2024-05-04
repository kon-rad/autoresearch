"use client"

/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { GlobalStateProvider } from "@/context/GlobalState"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <GlobalStateProvider>{children}</GlobalStateProvider>
    </SessionContextProvider>
  )
}
