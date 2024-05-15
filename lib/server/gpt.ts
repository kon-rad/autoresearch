import OpenAI from "openai"

const openai = new OpenAI()

export const askGPT = async (messages: any) => {

    const completion = await openai.chat.completions.create({
      messages:  messages,
      model: "gpt-3.5-turbo",
    })
  
    return completion.choices[0].message.content
}