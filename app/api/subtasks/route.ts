import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { fetchSubtasksBySearchQueryId } from "@/lib/database/searchQuery"

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    console.log("inside /api/subtasks")

    const { searchQueryId } = await req.json()
    const resp = await fetchSubtasksBySearchQueryId(searchQueryId)

    return new Response(JSON.stringify(resp))
  } catch (e: any) {
    console.error("Error: ", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
