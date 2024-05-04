"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
const AutoSearch = ({ currentSearch }: any) => {
  const [searchQuery, setSearchQuery] = useState(
    "what is the best ai trend of 2024"
  )
  const [searchResults, setSearchResults] = useState([]) // State to store search results

  const handleSearch = async () => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery }),
      })
      const data = await response.json()
      console.log("result: ", data) // Handle the response data as needed
      if (data.error) {
        return
      } else {
        setSearchResults(data) // Store the search results
      }
    } catch (error) {
      console.error("Error during search:", error)
    }
  }
  console.log("searchResults ", searchResults)

  return (
    <div className="max-w-fullscreen-xl mx-8 my-12 flex flex-col justify-center">
      <div className="flex w-full flex-row items-center">
        <Input
          className="my-4 mr-4 w-full py-2 "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Intermediate steps</AccordionTrigger>
            <AccordionContent>
              {(searchResults || []).map((result, index) => (
                <div key={index} title={result.title} className="flex flex-col">
                  <div className="text-sm">{result.content}</div>
                  <div className="text-xs text-gray-400">
                    query id: {result.queryId}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default AutoSearch
