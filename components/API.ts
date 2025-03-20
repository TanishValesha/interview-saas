// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Ensure the API key is only accessed server-side
// const genAI = new GoogleGenerativeAI("AIzaSyCZA1Cz_OVsEknpC_jtGu_Ul1GCAq2sg-I");

// export async function generateResponse(prompt: string) {
//   try {
//     // Use Gemini Pro model
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     // Generate content
//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     return {
//       success: true,
//       data: response.text(),
//     };
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }

import { Groq } from "groq-sdk";

// Securely store API key in environment variables
const groq = new Groq({
  apiKey:
    process.env.GROQ_API_KEY ||
    "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",
  dangerouslyAllowBrowser: true,
});

export async function generateResponse(prompt: string) {
  try {
    // Use a Groq-supported model (e.g., Mixtral or Llama)
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // or "llama3-70b-8192"
      messages: [{ role: "user", content: prompt }],
    });

    return {
      success: true,
      data: response.choices[0]?.message?.content ?? "No response",
    };
  } catch (error) {
    console.error("Groq API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
