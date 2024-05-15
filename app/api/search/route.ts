import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createSearchQuery } from "@/lib/database/searchQuery"
import { initiateSearchJob } from "@/lib/server/search"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

const getFirstPrompt = (searchQuery: string) => {
  return `You are an expert AI researching agent.
Create a set of 10 web search queries that will help you best
write a research paper that addresses and answers the following question.
'${searchQuery}'. 

Remember Only return the list of 10 web search queries and nothing else.
  `
}

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    console.log("inside /api/search")

    const { searchQuery } = await req.json()

    const firstPrompt = getFirstPrompt(searchQuery)

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert research agent." },
        { role: "user", content: firstPrompt },
      ],
      model: "gpt-3.5-turbo",
    })

    if (completion.choices[0]) {
      console.log("OpenAI response: ", completion.choices[0].message.content)
      const searchQueryId = await createSearchQuery({
        query: searchQuery,
        userId: "123",
        result: completion.choices[0].message.content,
      })

      
      console.log("searchQueryId", searchQueryId)
      initiateSearchJob({
        id: searchQueryId.id,
        query: searchQuery,
        result: completion.choices[0].message.content,
      })

      return new Response(
        JSON.stringify([
          {
            title: "substeps ",
            content: completion.choices[0].message.content,
            queryId: searchQueryId.id,
          },
        ])
      )
    } else {
      throw new Error("Failed to receive a valid response from OpenAI")
    }
  } catch (e: any) {
    console.error("Error: ", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
