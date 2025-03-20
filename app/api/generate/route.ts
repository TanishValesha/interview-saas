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
