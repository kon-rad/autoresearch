import Exa from "exa-js"
import OpenAI from "openai"
import {
  createSubtask,
  fetchSearchResultsBySearchQueryId,
  createSearchResult,
} from "@/lib/database/searchQuery"
import { generateAugmentedTextWithSearchResults } from "@/app/api/augment_api/route"
import { askLlamma3 } from "./llama"
import { askGPT } from "./gpt"

const openai = new OpenAI()
const shortenText = (str: string) => {
  // const words = str.split(' ');
  // return words.slice(0, 5000).join(' ');
  return str.substring(0, 30000)
}

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
Formulate a 1,000 word research paper that answers the question based on the provided research
that was done by your assistant. Take some time to think about it and answer the question
very carefully.

Cite search results using [\${{number}}](URL) notation. Only cite the most
relevant results that answer the question accurately. Place these citations at the end
of the sentence or paragraph that reference them - do not put them all at the end. If
different results refer to different entities within the same name, write separate
answers for each entity. If you want to cite multiple results for the same sentence,
format it as \`[\${{number1}}](URL) [\${{number2}}](URL)\`. However, you should NEVER do this with the
same number - if you want to cite \`number1\` multiple times for a sentence, only do
\`[\${{number1}}](URL)\` not \`[\${{number1}}](URL) [\${{number1}}](URL)\`
Include the URL when citing a source.

You should use bullet points in your answer for readability. Put citations where they apply
rather than putting them all at the end.

Question: ${userQuestion} 

Research results provided by your assistant: 
${exaAnswer}
Only return the research paper, do not add any prefix text. Do not say "based on the web results"
or anything of that kind.

`
  const answerAgentSystemPrompt = `
You are an expert researcher. Your job is to take in the web search results 
and formulate an answer response to a question.
`
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: answerAgentSystemPrompt,
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
  const AnswerSystemPrompt = `
  "You are an expert researcher. Your job is to take in the web search result analysis and use it to improve the original answer to the question. 
  DO NOT mention web results, or improving the answer.
  DO NOT RETURN ANYTHING OTHER THEN THE RESULT.`
  const newAnswerPrompt = `
You are an expert writer and researcher. Analyze the writings that was provided to
you by your and compose a 1,000 word research paper that 
answers the user question and references the given writings.

Given this new data from the first research paper, update the current synthesized research paper
in how it addresses and answers the user question.
DO NOT say anything other then the response.
Cite search results using [\${{number}}](URL) notation. Only cite the most
relevant results that answer the question accurately. Place these citations at the end
of the sentence or paragraph that reference them - do not put them all at the end. If
different results refer to different entities within the same name, write separate
answers for each entity. If you want to cite multiple results for the same sentence,
format it as \`[\${{number1}}](URL) [\${{number2}}](URL)\`. However, you should NEVER do this with the
same number - if you want to cite \`number1\` multiple times for a sentence, only do
\`[\${{number1}}](URL)\` not \`[\${{number1}}](URL) [\${{number1}}](URL)\`
Include the URL when citing a source.

You should use bullet points in your answer for readability. Put citations where they apply
rather than putting them all at the end.

Question: ${userQuestion}

New Research Paper: 
${newData}

Existing Research Paper:
${currAnswer}

Only return the new research paper. DO NOT include any other text other then the new answer. 
DO NOT mention the research assistant or the research paper.
ONLY RETURN THE CONTENT OF THE RESULT.
`
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: AnswerSystemPrompt,
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

  Your job is to do write a web search query for the query number ${i + 1} from this list:
  This list is a list of sub queries that you must perform.
  Only handle query number ${i + 1} from this query:
  ${data.response}
  `
    const newQuery = await getQueryFromAi(searchQuery)
    console.log("newQuery ", newQuery)
    const response = await performExaSearch(newQuery)
    console.log("response from exa that is summarized:  ", i, response)
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
    // const newAnswerWithCitations = await generateAugmentedTextWithSearchResults(
    //   newAnswerResponse,
    //   response
    // )
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
  const getSummary = async (resArr: any, query: string) => {
    const sumSystemPrompt = `You are an expert summarizer AI assistant.`
    const sumUserPrompt = `
Summarize the following content, paying special attention to how 
it addresses the question posed by the user.
ONLY RETURN THE SUMMARY, DO NOT INCLUDE ANYTHING ELSE.
Cite search results using [\${{number}}](URL) notation. Only cite the most
relevant results that answer the question accurately. Place these citations at the end
of the sentence or paragraph that reference them - do not put them all at the end. If
different results refer to different entities within the same name, write separate
answers for each entity. If you want to cite multiple results for the same sentence,
format it as \`[\${{number1}}](URL) [\${{number2}}](URL)\`. However, you should NEVER do this with the
same number - if you want to cite \`number1\` multiple times for a sentence, only do
\`[\${{number1}}](URL)\` not \`[\${{number1}}](URL) [\${{number1}}](URL)\`
Include the URL when citing a source.

You should use bullet points in your answer for readability. Put citations where they apply
rather than putting them all at the end.

    
The question:
${query}

The content:
${shortenText(resArr.join(`\n\n`))}
    
REMEMBER: Only return the summary.
`
    const sumMessages = [
      {
        role: "system",
        content: sumSystemPrompt,
      },
      { role: "user", content: sumUserPrompt },
    ]
    console.log("sumMessages: ", sumMessages)

    // const res = await askLlamma3(sumMessages, false);
    const res = await askGPT(sumMessages)
    return res
  }
  const getSummariesInBatches = async (exaResPrompt: string[]) => {
    const batchPromises = []
    const numOfRes = 2
    for (let i = 0; i < exaResPrompt.length; i += numOfRes) {
      const batch = exaResPrompt.slice(i, i + numOfRes)
      batchPromises.push(getSummary(batch, query))
    }
    const summaries = await Promise.all(batchPromises)
    return summaries.flat()
  }
  const exaResPrompt = exaRes.map(
    (res: any) => `
    title: ${res.title}
    url: ${res.url}
    published date: ${res.publishedDate}
    author: ${res.author}
    text: ${res.text}
    \n\n\n
  `
  )

  const summaries = await getSummariesInBatches(exaResPrompt)

  return summaries.join("\n\n")
}
