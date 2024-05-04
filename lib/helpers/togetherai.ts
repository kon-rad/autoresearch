import axios from "axios"

const generateImages = async (prompts: any) => {}

const faceSwapOnImage = async (image: any, target: any) => {
  // New function for face swapping
  const faceSwap = async () => {
    console.log("Face swapping with image:", selectedImage)
    // Implement the face swap logic here...
    if (!selectedImage) {
      alert("oops, you need to select an image first")
    }

    try {
      const base64Source = previewSource.split(",")[1]
      const base64Target = selectedImage.split(",")[1]

      const result = await axios.post("/api/image/generate", {
        source: base64Source,
        target: base64Target,
      })
      console.log("swap result ", result)

      const image = result?.data?.response

      setFaceSwappedImage(image)
      generateCaption()

      // Save the face-swapped image to local storage
      const existingSwappedImages = JSON.parse(
        localStorage.getItem("swappedImages") || "[]"
      )
      const newSwappedImages = [...existingSwappedImages, image]
      localStorage.setItem("swappedImages", JSON.stringify(newSwappedImages))
    } catch (error) {
      console.error("Error sending image to server:", error)
    }
  }
}

const generateImage = async (
  prompt: string,
  genN: number = 4,
  screenshot: string
) => {
  console.log(process.env.NEXT_PUBLIC_TOGETHER_API_KEY)

  try {
    const response = await fetch("https://api.together.xyz/inference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        // model: "runwayml/stable-diffusion-v1-5",
        // model: "stabilityai/stable-diffusion-xl-base-1.0",
        model: "SG161222/Realistic_Vision_V3.0_VAE",
        prompt: prompt,
        n: genN,
        steps: 20,
      }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = await response.json()
    console.log("data", data)

    // saveImagesToS3(
    //   data.output.choices.map((choice) => choice.image_base64),
    //   "generated"
    // )

    // Invoke this function after setting the images results in the generateImage function
    const resultVal = data.output.choices.map((choice) => {
      const imageBase64 = `data:image/jpeg;base64,${choice.image_base64}`
      return {
        ...choice,
        image_base64: imageBase64,
      }
    })

    const swappedImage = await callImageGenerateAPIFaceswap(
      resultVal,
      screenshot
    )

    return swappedImage
  } catch (error) {
    console.error("Failed to generate image:", error)
  }
}
const callImageGenerateAPIFaceswap = async (
  images: any[],
  screenshot: string,
  username: string = "123"
) => {
  const results = await Promise.all(
    images.map(async (image) => {
      try {
        const response = await axios.post("/api/image/generate", {
          source: image.image_base64,
          target: screenshot,
          username: username,
        })
        console.log("faceswap response ", response)

        return response?.data?.response
      } catch (error) {
        console.error("Error calling /api/image/generate:", error)
        return null
      }
    })
  )
  return results.filter((result) => result !== null)
}
export { generateImage, faceSwapOnImage }
