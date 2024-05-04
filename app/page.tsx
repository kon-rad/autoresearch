import React, { useState } from "react"
import AutoSearchContainer from "@/components/AutoSearchContainer"
import { fetchSearchQueriesByUser } from "@/lib/database/searchQuery"

export default async function Home() {
  const userSearches = await fetchSearchQueriesByUser("123")

  console.log("userSearches", userSearches)

  return (
    <div className="flex w-full">
      <AutoSearchContainer userSearches={userSearches} />
    </div>
  )
}
