import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

const getFirstPrompt = (searchQuery: string) => {
  return `You are an expert research agent.
  Create a comprehensive set of steps in order to answer the query:
  '${searchQuery}'. 
  
  List 10 subtasks needed to find the answer to the query.`
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
      return new Response(
        JSON.stringify([
          {
            title: "substeps ",
            content: completion.choices[0].message.content,
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
