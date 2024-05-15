"use client"

import React, { useState } from "react"
import Hero from "@/components/pages/hero"
import FeatureCards from "@/components/pages/feature-cards"
import Features from "@/components/pages/features"
import AutoSearch from "@/components/AutoSearch"
import UserSearches from "@/components/UserSearches"
import Sidebar from "./layout/sidebar"

export default function AutoSearchContainer({ userSearches }: any) {
  const [isSearchesVisible, setIsSearchesVisible] = useState(false)
  const [currentSearch, setCurrentSearch] = useState()

  const toggleSearches = () => {
    setIsSearchesVisible(!isSearchesVisible)
  }

  return (
    <div className="flex h-screen border-collapse overflow-hidden w-full">
        <Sidebar
          searches={userSearches}
          setCurrentSearch={setCurrentSearch}
        />
      <main className="max-w-screen-xl mx-auto flex-1 overflow-y-auto overflow-x-hidden pt-10 bg-secondary/10 pb-1">
        <AutoSearch currentSearch={currentSearch} />
      </main>
    </div>
  )
}
