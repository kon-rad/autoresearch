import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import Exa from "exa-js"

const openai = new OpenAI()

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const inputText =
    "Scholars in the school of new classical economics, which emerged in the 1970s, focus on the belief that the school of Keynesian economics is misguided. New classical scholars assert that the economy is never unbalanced, as Keynesian scholars believe, but instead that changes in an economy result from people's changing their spending habits as they interpret the news about the world."
  const questions: string[] = await generateResearchQuestions(inputText)
  const searchResult: string = await runExaSearch(questions)
  const augmentedText: string = await generateAugmentedTextWithSearchResults(
    inputText,
    searchResult
  )

  return new NextResponse(augmentedText)
}

export async function POST(req: NextRequest) {
  const inputText = await req.text()

  const questions: string[] = await generateResearchQuestions(inputText)

  const searchResult: string = await runExaSearch(questions)

  const augmentedText: string = await generateAugmentedTextWithSearchResults(
    inputText,
    searchResult
  )

  return new NextResponse(augmentedText)
}

export async function generateResearchQuestions(inputText: string) {
  const thread = await openai.beta.threads.create()
  let generatedResearchQuestions: string[] = []

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: inputText,
  })

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: "asst_zUoEj4qW5Rj8sorbPv1rwQB8",
  })

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id)

    let reversedMessages = messages.data.reverse()
    let messageContent: any = reversedMessages[1].content[0]
    let questionsString: string = messageContent.text.value
    let questionsList: string[] = Array.from(
      JSON.parse(questionsString).questions
    )

    for (const question of questionsList) {
      generatedResearchQuestions.push(question)
    }

    return generatedResearchQuestions
  } else {
    console.log(run.status)
  }

  return generatedResearchQuestions
}

export async function runExaSearch(questions: string[]) {
  const exa = new Exa(process.env.EXA_API_KEY)

  const results: string[] = []

  for (const question of questions) {
    const searchAndTextResults = await exa.searchAndContents(question, {
      text: true,
    })

    for (const result of searchAndTextResults.results) {
      results.push(JSON.stringify(result))
    }
  }

  return results.join("\n")
}

export async function generateAugmentedTextWithSearchResults(
  inputText: string,
  searchResult: string
) {
  const thread = await openai.beta.threads.create()
  let prompt = inputText + "\n\nSearch Result: " + searchResult
  let generatedAugmentedText: string = ""

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt,
  })

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: "asst_VEByfnDFcXCgezAm6rnQS2LU",
  })

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id)

    let reversedMessages = messages.data.reverse()
    let messageContent: any = reversedMessages[1].content[0]
    let questionsString: string = messageContent.text.value

    generatedAugmentedText = questionsString

    return generatedAugmentedText
  } else {
    console.log(run.status)
  }

  return generatedAugmentedText
}
