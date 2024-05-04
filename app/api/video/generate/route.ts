import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { generateImage } from "./helper"
import { generateVideoFromImage } from "@/lib/helpers/fal"

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
    console.log("inside /api/video /generate")

    const { image_url } = await req.json()
    // console.log("Received base64 video :", target, source);

    if (image_url) {
      console.log("calling gen video: ")

      const resp = await generateVideoFromImage(image_url)
      console.log("response: ", resp)

      return new Response(JSON.stringify(resp))
    } else {
      return NextResponse.json(
        { response: "you must provide source and target images " },
        { status: 200 }
      )
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
