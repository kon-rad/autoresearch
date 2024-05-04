import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createSearchQuery } from "@/lib/database/searchQuery"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

const getFirstPrompt = (searchQuery: string) => {
  return `You are an expert research agent.
  Create a comprehensive set of steps in order to answer the query:
  '${searchQuery}'. 
  
  List 10 subtasks web search queries needed to find the answer to the query.
  These will be only questions that you can find answers to by doing online queries.
  For each subtask formulate a web search query. 
  Afterwards you will perform an web search query and analyze the answers for 
  a comprehensive answer.
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

      return new Response(
        JSON.stringify([
          {
            title: "substeps ",
            content: completion.choices[0].message.content,
            queryId: searchQueryId,
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
