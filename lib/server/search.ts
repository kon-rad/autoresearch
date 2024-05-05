import Exa from "exa-js"
import OpenAI from "openai"
import {
  createSubtask,
  fetchSearchResultsBySearchQueryId,
  createSearchResult,
} from "@/lib/database/searchQuery"

const openai = new OpenAI()

async function getQueryFromAi(searchQuery: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert researcher. Your job is to write web queries.",
      },
      { role: "user", content: searchQuery },
    ],
    model: "gpt-3.5-turbo",
  })

  console.log("completion: ", completion.choices[0])

  return completion.choices[0].message.content
}

async function getAnswerFromAi(exaAnswer: string, userQuestion: string) {
  const exaPrompt = `
  Formulate an answer based on this web search results:
  Question: ${userQuestion}

  Web Search Results: 
  ${exaAnswer}


  `
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert researcher. Your job is to take in the web search results and formulate an answer response to a question.",
      },
      { role: "user", content: exaPrompt },
    ],
    model: "gpt-3.5-turbo",
  })

  return completion.choices[0].message.content
}
async function getNewAnswerFromAi(
  currAnswer: string,
  newData: string,
  userQuestion: string
) {
  const newAnswerPrompt = `
  Given this new data from the web search results, update the current answer to the query
  if it can be improved.
  If it doesn't help answer the question then just return the original answer.
  DO NOT say anything other then the response.
  
  Question: ${userQuestion}

  New Web Search Results: 
  ${newData}

  Existing Answer:
  ${currAnswer}

  Only return the new answer. DO NOT include any other text other then the new answer. DO NOT mention web results, or improving the answer. 
  `
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert researcher. Your job is to take in the web search result analysis and use it to improve the original answer to the question. DO NOT mention web results, or improving the answer. ",
      },
      { role: "user", content: newAnswerPrompt },
    ],
    model: "gpt-3.5-turbo",
  })

  return completion.choices[0].message.content
}
export const initiateSearchJob = async (data: any) => {
  for (let i = 0; i < 10; i++) {
    // Replace 'someLimit' with the actual limit of your loop

    // Implementation of performExaSearch
    const searchQuery = `You are an expert researcher working with a team. 
  Your job is to handle this one query that is your focus. 
  The primary question is: ${data.query}.


  Your job is to do write a web search for the query number ${i + 1} from this list:
  This list is a list of sub queries that you must perform.
  Only handle query number ${i + 1} from this query:
  ${data.response}
  `
    const newQuery = await getQueryFromAi(searchQuery)
    console.log("newQuery ", newQuery)
    const response = await performExaSearch(newQuery)
    console.log("response ", i, response)
    const aiAnswer = await getAnswerFromAi(response, data.query)
    console.log("ai answer ", aiAnswer)
    // update the answer if it is helpful
    // first get the answer from the database based on search query id data.id
    // then ask assistant to generate an analysis based on exa results plus general query
    // then using the analysis update the result if needed
    const currAnswer = await fetchSearchResultsBySearchQueryId(data.id)
    const currAnswerContent = currAnswer
      ? currAnswer.content
      : "There is no first question. Create the first answer."
    const newAnswerResponse = await getNewAnswerFromAi(
      currAnswerContent,
      aiAnswer,
      data.query
    )
    console.log("newAnswerResponse", newAnswerResponse)
    const ansResp = await createSearchResult({
      content: newAnswerResponse,
      query: data.query,
      searchQueryId: data.id,
      numberOfUpdates: currAnswer?.numberOfUpdates
        ? currAnswer?.numberOfUpdates + 1
        : 1,
    })

    const cResp = await createSubtask({
      result: aiAnswer,
      query: response,
      analysis: aiAnswer,
      searchQueryId: data.id,
    })
    console.log("cResp ", cResp)
  }
}

export const performExaSearch = async (query: string) => {
  // Initialize Exa with API key
  const exa = new Exa(process.env.EXA_API_KEY)
  // Search and get text contents using the generated query
  const searchAndTextResults = await exa.searchAndContents(query, {
    text: true,
  })

  // data.response.results
  const exaRes = searchAndTextResults.results
  // score: 0.1665622442960739,
  // title: "GPT-4 is bigger and better than ChatGPT—but OpenAI won’t say why",
  // id: "https://www.technologyreview.com/2023/03/14/1069823/gpt-4-is-bigger-and-better-chatgpt-openai",
  // url: "https://www.technologyreview.com/2023/03/14/1069823/gpt-4-is-bigger-and-better-chatgpt-openai",
  // publishedDate: "2023-03-14",
  // author: "Will Douglas Heaven",
  // text:
  const exaResPrompt = exaRes.map(
    (res: any) => `
    title: ${res.title}
    url: ${res.title}
    published date: ${res.publishedDate}
    author: ${res.author}
    text: ${res.text}
    \n\n\n
  `
  )

  return exaResPrompt.join("\n\n")
}
