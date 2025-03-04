import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is only accessed server-side
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateResponse(prompt: string) {
  try {
    // Use Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return {
      success: true,
      data: response.text(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
