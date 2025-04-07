// components/libs/generateCohereEmbedding.ts
export async function generateCohereEmbedding(text: string): Promise<number[]> {
  const COHERE_API_KEY = process.env.COHERE_API_KEY;

  if (!COHERE_API_KEY) {
    throw new Error("Cohere API key is missing in environment variables.");
  }

  const response = await fetch("https://api.cohere.ai/v1/embed", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      texts: [text],
      model: "embed-english-v3.0", // or "embed-multilingual-v3.0"
      input_type: "search_document", // or "search_query" depending on use-case
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.embeddings || !data.embeddings[0]) {
    console.error("Cohere Error:", data);
    throw new Error("Failed to generate embedding from Cohere.");
  }

  return data.embeddings[0]; // This is your [1024-dim] vector
}
