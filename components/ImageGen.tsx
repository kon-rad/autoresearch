"use client"

import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import axios from "axios"
import UserImage from "./UserImage"
import SwappedImagesDisplay from "./SwappedImagesDisplay"
import { useS3Upload } from "next-s3-upload"
import { useToast } from "@/components/ui/use-toast"
import { createGenerated } from "@/lib/database/generated"
import { useGlobalState } from "@/context/GlobalState"
import IntermediateSteps from "./IntermediateSteps"
import {
  generateScript,
  generateImagePrompts,
  genImageStory,
  genImagePrompt,
  generateScriptForAudio,
} from "@/lib/helpers/gemini"
import { generateImage } from "@/lib/helpers/togetherai"
import GeneratedImages from "./GeneratedImages"
import { generateVideoFromImage } from "@/lib/helpers/fal"
import CombineVideos from "@/components/CombineVideos"

const userId = "123"

const ImageGen = ({ userImagesGen }: any) => {
  const [imagesResults, setImagesResults] = useState([])
  const [faceSwappedImage, setFaceSwappedImage] = useState()
  const [prompt, setPrompt] = useState("")
  const [characterPrompt, setCharacterPrompt] = useState("")
  const [caption, setCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState(null) // New state for storing selected image
  const [previewSource, setPreviewSource] = useState("")
  const { uploadToS3, files } = useS3Upload()
  const { toast } = useToast()
  const {
    characterDesc,
    setCharacterDesc,
    filmPlot,
    setFilmPlot,
    genScript,
    setGenScript,
    genImagePrompts,
    setGenImagePrompts,
    genImages,
    setGenImages,
    genVideos,
    setGenVideos,
  } = useGlobalState()
  const [audioSrc, setAudioSrc] = useState("")

  const fetchAudio = async (speakText: string) => {
    const response = await fetch("/api/voice/fromtext", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ speakText: speakText }),
    })
    console.log("audio url response ", response)

    if (response.ok) {
      const data = await response.json()
      setAudioSrc(data)
    } else {
      console.error("Failed to fetch audio")
    }
  }
  const saveImagesToS3FromBlob = async (
    images: any,
    saveType: string = "generated",
    prompt: string,
    imageNumOfSeries: number
  ) => {
    for (const { image_base64 } of images) {
      const blob = await (await fetch(image_base64)).blob()
      const file = new File([blob], "image.jpeg", { type: "image/jpeg" })
      const { url } = await uploadToS3(file)
      console.log("saved ur from s3 ", url)

      if (saveType === "generated") {
        await createGenerated({
          url: url,
          userId: userId,
          prompt: prompt,
          type: saveType,
        })
      }
      toast({
        title: "Successfully saved image!",
      })
    }
  }
  const saveImagesToS3FromURL = async (
    imageUrl: string,
    saveType: string = "generated",
    prompt: string,
    imageNumOfSeries: number
  ) => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const file = new File([blob], `image_${imageNumOfSeries}.jpeg`, {
      type: "image/jpeg",
    })
    const { url } = await uploadToS3(file)
    console.log("saved url from s3 ", url)

    if (saveType === "generated") {
      await createGenerated({
        url: url,
        userId: userId,
        prompt: prompt,
        type: saveType,
      })
    }
    toast({
      title: "Successfully saved image!",
    })
  }
  const saveVideoToS3FromURL = async (
    videoUrl: string,
    saveType: string = "generated",
    prompt: string,
    videoNumOfSeries: number
  ) => {
    const response = await fetch(videoUrl)
    const blob = await response.blob()
    const file = new File([blob], `video--123.mp4`, {
      type: "video/mp4",
    })
    const { url } = await uploadToS3(file)
    console.log("saved url from s3 ", url)

    return await createGenerated({
      url: url,
      userId: userId,
      prompt: prompt,
      type: saveType,
    })
    toast({
      title: "Successfully saved video!",
    })
  }
  // New function for handling image selection
  const selectImage = (image) => {
    setSelectedImage(image)
  }
  const generateCaption = async () => {
    console.log("Generating caption based on prompt:", prompt)
    if (!prompt) {
      alert("Please enter a prompt for the caption generation.")
      return
    }

    try {
      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
              {
                role: "user",
                content: `Q: Generate a witty Instagram caption of an image that is generated from this prompt: ${prompt}\nA:`,
              },
            ],
            temperature: 0.8,
            max_tokens: 60,
          }),
        }
      )
      console.log("response", response)

      if (!response.ok) {
        throw new Error("Failed to generate caption")
      }

      const data = await response.json()
      const caption = data.choices[0].message.content
      console.log("Generated caption:", caption)
      setCaption(caption)
    } catch (error) {
      console.error("Failed to generate caption:", error)
    }
  }
  const handleSourceImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewSource(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const saveCharacter = async () => {
    console.log("saveCharacter")
  }
  const handleGenFilm = async () => {
    // { generateScript, generateImagePrompts }
    const script = await generateScript(filmPlot)
    const scriptForAudio = await generateScriptForAudio(script)
    fetchAudio(scriptForAudio)
    // const imagePrompts = await generateScript(script)
    setGenScript(script)
    // setGenImagePrompts(imagePrompts)
    const imageDesc = await genImageStory(script, characterDesc)
    console.log("imageDesc - ", imageDesc)
    console.log("handleGenFilm")

    const image1 = await genImagePrompt(imageDesc, "1", characterDesc)
    const image2 = await genImagePrompt(imageDesc, "2", characterDesc)
    const image3 = await genImagePrompt(imageDesc, "3", characterDesc)
    const image4 = await genImagePrompt(imageDesc, "4", characterDesc)
    const image5 = await genImagePrompt(imageDesc, "5", characterDesc)
    setGenImagePrompts([image1, image2, image3, image4, image5])
    console.log("images: ", image1, image2, image3, image4, image5)

    // await generateImagesForPrompts([image1, image2, image3, image4, image5])

    const videoUrls = []

    const image1Res = await generateImage(image1, 1, previewSource)
    console.log("image1Res", image1Res)
    saveImagesToS3FromURL(image1Res, "generated", imageDesc, 1)
    const video1 = await axios.post("/api/video/generate", {
      image_url: image1Res[0],
    })
    setGenImages((prev: any) => [...prev, image1Res])
    console.log("video1 ", video1)
    saveVideoToS3FromURL(
      video1?.data?.video?.url,
      "generatedVideo",
      imageDesc,
      1
    )
    setGenVideos((prev: any) => [...prev, video1?.data?.video?.url])

    const image2Res = await generateImage(image2, 1, previewSource)
    console.log("image2Res", image2Res)
    saveImagesToS3FromURL(image2Res, "generated", imageDesc, 1)
    const video2 = await axios.post("/api/video/generate", {
      image_url: image2Res[0],
    })
    setGenImages((prev: any) => [...prev, image2Res])
    console.log("video2 ", video2)
    saveVideoToS3FromURL(
      video2?.data?.video?.url,
      "generatedVideo",
      imageDesc,
      1
    )
    setGenVideos((prev: any) => [...prev, video2?.data?.video?.url])

    const image3Res = await generateImage(image3, 1, previewSource)
    console.log("image3Res", image3Res)
    saveImagesToS3FromURL(image3Res, "generated", imageDesc, 1)
    const video3 = await axios.post("/api/video/generate", {
      image_url: image3Res[0],
    })
    setGenImages((prev: any) => [...prev, image3Res])
    console.log("video3 ", video3)
    saveVideoToS3FromURL(
      video3?.data?.video?.url,
      "generatedVideo",
      imageDesc,
      1
    )
    setGenVideos((prev: any) => [...prev, video3?.data?.video?.url])

    const image4Res = await generateImage(image4, 1, previewSource)
    console.log("image4Res", image4Res)
    saveImagesToS3FromURL(image4Res, "generated", imageDesc, 1)
    const video4 = await axios.post("/api/video/generate", {
      image_url: image4Res[0],
    })
    setGenImages((prev: any) => [...prev, image4Res])
    console.log("video4 ", video4)
    saveVideoToS3FromURL(
      video4?.data?.video?.url,
      "generatedVideo",
      imageDesc,
      1
    )
    setGenVideos((prev: any) => [...prev, video4?.data?.video?.url])

    // video 5
    const image5Res = await generateImage(image5, 1, previewSource)
    console.log("image5Res", image5Res)
    saveImagesToS3FromURL(image5Res, "generated", imageDesc, 1)
    const video5 = await axios.post("/api/video/generate", {
      image_url: image5Res[0],
    })
    setGenImages((prev: any) => [...prev, image5Res])
    console.log("video5 ", video5)
    const vidUrl5 = await saveVideoToS3FromURL(
      video5?.data?.video?.url,
      "generatedVideo",
      imageDesc,
      1
    )
    setGenVideos((prev: any) => [...prev, video5?.data?.video?.url])
    const newVideoUrls = [...genVideos, video5?.data?.video?.url]

    // const combinedVideo = await axios.post("/api/video/combine", {
    //   videoUrls: newVideoUrls,
    // })
    // console.log("combinedVideo", combinedVideo)
  }
  const handlePost = () => {
    console.log("handlePost")
  }

  // Save images to local storage
  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="mb-6  mt-12 text-xl">1. Describe your character</h1>
      <Textarea
        value={characterDesc}
        onChange={(e) => setCharacterDesc(e.target.value)}
        className="my-4 h-[200px] w-full max-w-[700px]"
        placeholder="Describe your character"
      />
      <Button onClick={saveCharacter} className="my-2">
        save character
      </Button>
      <h2 className="mb-6 mt-12 text-xl">2. Take a selfie</h2>
      <UserImage setPreviewSource={setPreviewSource} />
      <h2 className="mb-6 mt-12 text-xl">
        3. Describe the plot of the short film
      </h2>
      <Textarea
        value={filmPlot}
        onChange={(e) => setFilmPlot(e.target.value)}
        className="my-4  mb-12 h-[300px] w-full max-w-[700px]"
        placeholder="Describe the film plot"
      />
      <Button onClick={handleGenFilm} className="my-2">
        generate film
      </Button>
      <Button onClick={handlePost} className="my-2">
        post to Instagram
      </Button>
      {audioSrc && (
        <div className="my-6 flex flex-col justify-center">
          <h2 className="my-4 text-xl">Short Film Audio</h2>
          <audio controls src={audioSrc} />
        </div>
      )}
      <IntermediateSteps />
      <GeneratedImages userImagesGen={userImagesGen} />
    </div>
  )
}

export default ImageGen
