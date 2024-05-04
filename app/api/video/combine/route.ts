// import multer from "multer"
// import ffmpeg from "fluent-ffmpeg"
// import axios from "axios"
// import { NextRequest, NextResponse } from "next/server"

// const upload = multer({ storage: multer.memoryStorage() })

// async function downloadVideo(url: string) {
//   const response = await axios.get(url, { responseType: "stream" })
//   return response.data
// }
// export const POST = async (req: any): Promise<Response> => {
//   try {
//     const { videoUrls } = req.body

//     if (!videoUrls || videoUrls.length === 0) {
//       return NextResponse.json({ error: "missing videoUrls" }, { status: 500 })
//     }

//     const command = ffmpeg()

//     // Download each video and add it to the FFmpeg command
//     for (const url of videoUrls) {
//       const videoStream = await downloadVideo(url)
//       command.addInput(videoStream)
//     }

//     // Execute the command to combine videos
//     command
//       .mergeToFile("/tmp/output.mp4", "/tmp")
//       .on("error", (err) => {
//         console.error("FFmpeg error:", err)
//         return NextResponse.json(
//           { error: "missing videoUrls" },
//           { status: 500 }
//         )
//       })
//       .on("end", () => {
//         console.log("Video processing completed")
//         // res.status(200).sendFile("/tmp/output.mp4")
//         return new Response(JSON.stringify("/tmp/output.mp4"))
//       })
//   } catch (error) {
//     console.error("Error:", error)
//     return NextResponse.json({ error: "missing videoUrls" }, { status: 500 })
//   }
// }
