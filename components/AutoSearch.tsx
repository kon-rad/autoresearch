"use client"

import { useEffect, useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
const AutoSearch = ({ currentSearch }: any) => {
  const [subtasksArr, setSubtasksArr] = useState([])
  const [searchQueryId, setSearchQueryId] = useState(
    currentSearch ? currentSearch.id : null
  )
  const [searchQuery, setSearchQuery] = useState(
    "what is the best ai trend of 2024"
  )
  const [searchResults, setSearchResults] = useState([]) // State to store search results
  const [isPending, startTransition] = useTransition() // useTransition for managing state transitions

  useEffect(() => {
    console.log("searchQueryId called", searchQueryId)

    const fetchSubtasks = async () => {
      try {
        const response = await fetch("/api/subtasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchQueryId }),
        })
        const data = await response.json()
        setSubtasksArr(data) // Assuming the API returns an array of subtasks
      } catch (error) {
        console.error("Error fetching subtasks:", error)
      }
    }

    let intervalId
    if (searchQueryId) {
      intervalId = setInterval(fetchSubtasks, 4000) // Call fetchSubtasks every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId) // Clear the interval when the component unmounts or searchQueryId changes
      }
    }
  }, [searchQueryId])

  const handleSearch = async () => {
    startTransition(async () => {
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
          setSearchQueryId(data[0].queryId)
        }
      } catch (error) {
        console.error("Error during search:", error)
      }
    })
  }

  console.log("searchResults ", searchResults)
  console.log("searchQueryId ", searchQueryId)

  return (
    <div className="max-w-fullscreen-xl mx-8 my-12 flex flex-col justify-center">
      <div className="flex w-full flex-row items-center">
        <Input
          className="my-4 mr-4 w-full py-2 "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
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
              <h3 className="text-md my-4">subtasks:</h3>
              <div className="my-2 flex flex-col">
                {(subtasksArr || []).map((st: any) => {
                  return (
                    <div key={st.id} className="my-2 w-full text-xs">
                      {st.analysis}
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default AutoSearch
