import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

// Initialize Groq securely on the server
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      success: true,
      data: response.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// // Initialize OpenAI with GitHub-hosted model endpoint
// const openai = new OpenAI({
//   apiKey: process.env.GITHUB_TOKEN, // From your .env
//   baseURL: "https://models.github.ai/inference", // GitHub endpoint
// });

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     const response = await openai.chat.completions.create({
//       model: "openai/gpt-4.1",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     return NextResponse.json({
//       success: true,
//       data: response.choices[0]?.message?.content,
//     });
//   } catch (error) {
//     console.error("GitHub AI API Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
