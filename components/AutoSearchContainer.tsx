"use client"

import React, { useState } from "react"
import Hero from "@/components/pages/hero"
import FeatureCards from "@/components/pages/feature-cards"
import Features from "@/components/pages/features"
import AutoSearch from "@/components/AutoSearch"
import UserSearches from "@/components/UserSearches"

export default function AutoSearchContainer({ userSearches }: any) {
  const [isSearchesVisible, setIsSearchesVisible] = useState(true)
  const [currentSearch, setCurrentSearch] = useState()

  const toggleSearches = () => {
    setIsSearchesVisible(!isSearchesVisible)
  }

  return (
    <div className="flex w-full">
      <button onClick={toggleSearches} className="p-2 text-xl">
        {isSearchesVisible ? "<" : ">"}
      </button>
      {isSearchesVisible && (
        <div className="w-1/4">
          <UserSearches
            searches={userSearches}
            setCurrentSearch={setCurrentSearch}
          />
        </div>
      )}
      <div className={`${isSearchesVisible ? "w-3/4" : "w-full"} mx-auto`}>
        <AutoSearch currentSearch={currentSearch} />
      </div>
    </div>
  )
}
