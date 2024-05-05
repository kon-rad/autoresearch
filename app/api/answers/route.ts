import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { fetchAllSearchResultsBySearchQueryId } from "@/lib/database/searchQuery"

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    console.log("inside /api/answers")

    const { searchQueryId } = await req.json()
    const resp = await fetchAllSearchResultsBySearchQueryId(searchQueryId)

    return new Response(JSON.stringify(resp))
  } catch (e: any) {
    console.error("Error: ", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
