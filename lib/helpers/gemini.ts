const { GoogleGenerativeAI } = require("@google/generative-ai")

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

const generateScript = async (plotDesc: string) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
  })

  const prompt = `Write a short story script based on this plot description:
  ${plotDesc}
  `

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  console.log("text ", text)

  console.log(text)

  return text
}
const generateScriptForAudio = async (scriptText: string) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
  })

  const prompt = `Take this script and extract only the text for the voice actor narrator to read. DO NOT include any text 
  other the lines being spoken. The voice actor narrator will read all the text returned.
  ${scriptText}
  `

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  console.log("text ", text)

  console.log(text)

  return text
}

const genImageStory = async (imageStory: string, characterDesc: string) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
  })

  const prompt = `Write a list of detailed descriptions of images that tell this story. 
    List them from 1-5. 
    For example: 1. The main character is sitting at a desk while the sun is rising outside his window.

    Make sure the story features this main character. The main character should appear in the center
    of every one of the 5 scenes: 
    ${characterDesc}

    The story:
    ${imageStory}
    `

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  console.log("genImageStory ", text)
  return text
}

const generateImagePrompts = async (filmScript: string) => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Create 5 image generation prompts based on this film script: ${filmScript}`,
          },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
    },
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("function calling script: ", data)
    return data
  } catch (error) {
    console.error("Error generating image prompts: ", error)
    throw error
  }
}

const genImagePrompt = async (
  imagesDesc: string,
  imageNumber: string,
  characterDesc: string
) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
  })

  const prompt = `Write a prompt for an image generating AI model.
    Take the description number ${imageNumber} from this story. 
    Then generate a prompt for an AI image generator.
    Make sure the main character is the feature of the story, and that they are clearly visible.


    The images:
    ${imagesDesc}

    The character description:
    ${characterDesc} 

    Remember only return the prompt for the image number: ${imageNumber}
    `

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  console.log("genImageStory ", text)
  return text
}

export {
  generateScript,
  generateImagePrompts,
  genImageStory,
  genImagePrompt,
  generateScriptForAudio,
}
