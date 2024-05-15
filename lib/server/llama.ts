
const togetherAPIKey = process.env.TOGETHER_API_KEY; // Ensure you have this environment variable set
const togetherAPIURL = "https://api.together.xyz/v1/chat/completions";

const gemma = "google/gemma-2b-it";
const llama38b = "meta-llama/Llama-3-8b-chat-hf";
const llama2 = "meta-llama/Llama-2-13b-chat-hf";
export const askLlamma3 = async (messages: any, stream: boolean = false) => {
  try {
    const response = await fetch(togetherAPIURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${togetherAPIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: llama38b,
        messages,
        temperature: 0.8,
        stream_tokens: stream,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("togethe rresponse :", data.choices[0].message);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching question from Together API:", error);
    throw error;
  }
};