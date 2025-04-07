import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const index = pinecone.index("mock-interview");
// const index = pinecone.Index(process.env.PINECONE_INDEX!);

export async function searchInPinecone(
  embedding: number[],
  interviewId: string,
  topK = 3
) {
  const result = await index.query({
    topK,
    vector: embedding,
    includeMetadata: true,
    filter: {
      interviewId: { $eq: interviewId },
    },
  });

  return result.matches; // Array of most similar entries
}
