import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { getAllGeneratedByUserId } from "@/lib/database/generated"

export const replicateClient = axios.create({
  baseURL: "https://dreambooth-api-experimental.replicate.com",
  headers: {
    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "*",
  },
})

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    console.log("inside /api/images/user")

    const { userId, imageType } = await req.json()
    const resp = await getAllGeneratedByUserId(userId)

    console.log("response: ", resp)

    return new Response(JSON.stringify(resp))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
