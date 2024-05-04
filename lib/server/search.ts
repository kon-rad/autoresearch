import Exa from "exa-js"
import OpenAI from "openai"
import { createSubtask } from "@/lib/database/searchQuery"

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

  console.log("completion: ", completion)

  return completion.data.choices[0].text.trim()
}
export const initiateSearchJob = async (
  jobId: any,
  data: { query: string; response: string }
) => {
  for (let i = 0; i < 10; i++) {
    // Replace 'someLimit' with the actual limit of your loop
    const response = await performSearch(i + 1, data.response, data.query)
    console.log("response ", i, response)

    const cResp = await createSubtask({
      response: response,
      searchQueryId: jobId,
    })
    console.log("cResp ", cResp)
  }
}

export const performSearch = async (
  queryNumber: number,
  query: string,
  ogQuery: string
) => {
  // Implementation of performSearch
  const searchQuery = `You are an expert researcher working with a team. 
  Your job is to handle this one query that is your focus. 
  The primary question is: ${ogQuery}.


  Your job is to do write a web search for the query number ${queryNumber} from this list:
  This list is a list of sub queries that you must perform.
  Only handle query number ${queryNumber} from this query:
  ${query}
  `
  const query1 = await getQueryFromAi(searchQuery)
  console.log("query1 ", query1)

  // Initialize Exa with API key
  const exa = new Exa(process.env.EXA_API_KEY)
  // Search and get text contents using the generated query
  const searchAndTextResults = await exa.searchAndContents(query1, {
    text: true,
  })

  return searchAndTextResults
}
