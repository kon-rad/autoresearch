import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    console.log("inside /api/search")

    const { searchQuery } = await req.json()

    console.log("response: ", searchQuery)

    return new Response(JSON.stringify(searchQuery))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
