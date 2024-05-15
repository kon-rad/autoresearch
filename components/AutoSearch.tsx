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
import { RelatedQuestions } from "@/components/RelatedQuestions" // Import the RelatedQuestions component
import ReactMarkdown from "react-markdown"
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";

const AutoSearch = ({ currentSearch }: any) => {
  const [subtasksArr, setSubtasksArr] = useState([])
  const [searchAnswers, setSearchAnswers] = useState([])
  const [searchQueryId, setSearchQueryId] = useState(
    currentSearch ? currentSearch.id : null
  )
  const [searchQuery, setSearchQuery] = useState(
    ""
  )
  const [searchResults, setSearchResults] = useState([]) // State to store search results
  const [isPending, startTransition] = useTransition() // useTransition for managing state transitions

  useEffect(() => {
    if (currentSearch && currentSearch.id) {
      setSearchQueryId(currentSearch.id);
      setSearchQuery(currentSearch.query)
    }
  }, [currentSearch])

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

        // New fetch call to /api/answers
        const answersResponse = await fetch("/api/answers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchQueryId }),
        })
        const answersData = await answersResponse.json()
        setSearchAnswers(answersData || [])
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

  console.log("searchAnswers ", searchAnswers)

  return (
    <div className="flex-grow flex max-w-fullscreen-xl mx-8 my-12 flex flex-col justify-center">
      <div className="flex flex-grow flex flex-row items-center">
        <Input
          className="my-4 mr-4 flex-grow flex py-2 "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>
      <div className="mt-4">
        <Card className="">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactMarkdown className="prose dark:prose-invert">
              {searchAnswers && searchAnswers[0] ? searchAnswers[0].content : ""}
            </ReactMarkdown>
          </CardContent>
        </Card>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="answers">
            <AccordionTrigger>Previous Results</AccordionTrigger>
            <AccordionContent>
              {(searchAnswers || []).map((ans, index) => (
                <div key={index} title={ans.title} className="flex flex-col">
                  <div className="text-sm">
                    <ReactMarkdown className="prose dark:prose-invert">
                      {ans.content}
                    </ReactMarkdown>
                  </div>
                  <div className="text-xs text-gray-400">
                    {ans.numberOfUpdates}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="results">
            <AccordionTrigger>Intermediate steps</AccordionTrigger>
            <AccordionContent>
              {(searchResults || []).map((result, index) => (
                <div key={index} title={result.title} className="flex flex-col">
                  <div className="text-sm">
                    <ReactMarkdown className="prose dark:prose-invert">
                      {result.content}
                    </ReactMarkdown>
                  </div>
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
                    <ReactMarkdown className="prose dark:prose-invert">
                      {st.analysis}
                    </ReactMarkdown>
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="w-1/4">
          <RelatedQuestions searchQueryId={searchQueryId} />
        </div>
      </div>
    </div>
  )
}

export default AutoSearch
