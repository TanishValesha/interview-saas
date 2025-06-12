import { getInterviewDetails } from "@/components/libs/getInterviewFunction";
import { prisma } from "@/components/libs/prisma";
import createFeedbackPrompt from "@/components/prompts/mockFeedback";
import { NextResponse } from "next/server";

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

  const previousConvo = await prisma.mockModel.findMany({
    where: {
      interviewId: interviewData.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let conversation = "";

  for (let i = 0; i < previousConvo.length - 1; i++) {
    const question = previousConvo[i];
    const answer = previousConvo[i + 1];

    if (question.sender == "interviewer" && answer.sender == "candidate") {
      conversation += `Question: ${question.text}\n Answer: ${answer.text}\n \n`;
    }
  }

  const prompt = createFeedbackPrompt({ ...interviewData, conversation });

  const AIResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    }
  );

  if (!AIResponse.ok) {
    const errorText = await AIResponse.text();
    return NextResponse.json(
      { error: "Failed to get the feedback", details: errorText },
      { status: 500 }
    );
  }

  const { data } = await AIResponse.json();

  return NextResponse.json({
    success: true,
    message: "Feedback generated successfully",
    data: data,
  });
}
