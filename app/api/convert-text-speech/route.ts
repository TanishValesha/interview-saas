import { NextResponse } from "next/server";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📦 Raw body:", body);

    const { text } = body;
    console.log("✅ Received text:", text);

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Correct endpoint for TTS
    const response = await fetch(
      `https://api.deepgram.com/v1/speak?model=aura-helios-en`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    // Log the response status and text to help troubleshoot
    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS failed with status:", response.status);
      console.error("Error details:", errorText);
      return NextResponse.json(
        { error: "Failed to convert text to speech" },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("TTS Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
