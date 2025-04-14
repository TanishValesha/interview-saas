// app/api/interview/start/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/components/libs/prisma";
import { startMock } from "@/components/prompts/mockStartPrompt";
import { getInterviewDetails } from "@/components/libs/getInterviewFunction";
import { apiUrl } from "@/components/libs/apiUrl";

interface InterviewParams {
  id: string;
  jobTitle: string;
  experienceLevel: "entry" | "medium" | "senior" | "lead";
  jobDescription: string;
  companyDescription?: string;
  requiredSkills: string;
  difficultyLevel: "easy" | "medium" | "hard";
  questionTypes: "theoretical" | "practical";
}

export async function POST(req: Request) {
  const body = await req.json();
  const { slug } = body;
  const interviewData: InterviewParams = await getInterviewDetails(slug);

  const prompt = startMock(interviewData);

  const AIResponse = await fetch(`${apiUrl}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });

  if (!AIResponse.ok) {
    const errorText = await AIResponse.text();
    return NextResponse.json(
      { error: "Failed to get AI response", details: errorText },
      { status: 500 }
    );
  }

  const { data } = await AIResponse.json();
  console.log(interviewData);

  // 3. Save question in DB
  const savedQuestion = await prisma.mockModel.create({
    data: {
      text: data,
      sender: "interviewer",
      interviewId: interviewData.id,
    },
  });

  // 4. Return interview ID + first question
  return NextResponse.json({
    interviewId: interviewData.id,
    question: savedQuestion.text,
  });
}
