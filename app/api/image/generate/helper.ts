import debug from "debug"
import download from "download"
import Replicate from "replicate"
function ensureBase64Padding(data: string): string {
  while (data.length % 4 !== 0) {
    data += "="
  }
  return data
}

export const generateImage = async (
  source: any,
  target: any,
  username: string
) => {
  const log = debug("workflow")

  const replicateAPIKey = process.env.REPLICATE_API_TOKEN as string
  if (!replicateAPIKey) {
    throw new Error("REPLICATE_API_KEY is not set")
  }
  console.log("inside generateImage: ")

  console.log("Replicate API key found")

  const replicate = new Replicate({
    auth: replicateAPIKey,
  })

  console.log(`source and target running`)

  const mimeType = "image/png"

  console.log("Running faceswap...")
  // Ensure the base64 strings are correctly padded
  const paddedSource = ensureBase64Padding(source)
  const paddedTarget = ensureBase64Padding(target)

  // console.log("paddedSource", paddedSource)
  // console.log("paddedTarget", paddedTarget)

  const swappedUrl = (await replicate.run(
    "omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe",
    {
      input: {
        // target_image: `data:${mimeType};base64,${paddedTarget}`,
        // swap_image: `data:${mimeType};base64,${paddedSource}`,
        target_image: source,
        swap_image: target,
      },
    }
  )) as unknown as string
  console.log("Faceswap run complete swappedUrl ", swappedUrl)
  console.log("Faceswap run complete")

  // const swappedFilename = `${username}.png`
  // const dlDir = "./public/generated"
  // console.log("dl: ", swappedFilename, dlDir)
  console.log("swappedUrl ", swappedUrl)

  // await download(swappedUrl, dlDir, { filename: swappedFilename })

  console.log("swappedUrl: ", swappedUrl)
  // console.log(`File ${swappedFilename} downloaded`)
  return swappedUrl
}
