import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "./helper";
import debug from "debug";

export const replicateClient = axios.create({
  baseURL: "https://dreambooth-api-experimental.replicate.com",
  headers: {
    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "*",
  },
});

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    const log = debug("generate");
    log("inside /api/image/generate");
    console.log("inside /api/image/generate");

    const { target, source, username } = await req.json();
    // console.log("Received base64 image:", target, source);

    if (target && source) {
      console.log("calling generateImage: ");

      const resp = await generateImage(source, target, username);
      console.log("response: ", resp);

      return new Response(JSON.stringify({ response: resp }));
    } else {
      return NextResponse.json(
        { response: "you must provide source and target images " },
        { status: 200 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
