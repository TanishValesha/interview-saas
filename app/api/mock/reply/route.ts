import { NextResponse } from "next/server";
import { prisma } from "@/components/libs/prisma";
// import { startMock } from "@/components/prompts/mockStartPrompt";
import { getInterviewDetails } from "@/components/libs/getInterviewFunction";
import { apiUrl } from "@/components/libs/apiUrl";
import { generateCohereEmbedding } from "@/components/libs/generateCohereEmbedding";
import { searchInPinecone } from "@/components/libs/searchInPinecone";

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
  const { slug, userAnswer } = body;
  const interviewData: InterviewParams = await getInterviewDetails(slug);

  const savedUserAnswer = await prisma.mockModel.create({
    data: {
      text: userAnswer,
      sender: "candidate",
      interviewId: interviewData.id,
    },
  });

  const embedding = await generateCohereEmbedding(userAnswer);

  await prisma.answerEmbedding.create({
    data: {
      answerText: userAnswer,
      embedding: embedding,
      mockModelId: savedUserAnswer.id,
      interviewId: interviewData.id,
    },
  });

  const similarAnswers = await searchInPinecone(embedding, interviewData.id);

  const previousConvo = await prisma.mockModel.findMany({
    where: {
      interviewId: interviewData.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let conversation = "";

  for (let i = 0; i < previousConvo.length; i++) {
    const question = previousConvo[i];
    const answer = previousConvo[i + 1];

    if (question.sender == "interviewer" && answer.sender == "candidate") {
      conversation += `Question: ${question.text}\n Answer: ${answer.text}\n \n`;
    }
  }

  const prompt = `
You are conducting a mock interview for a job role, details\n"
"Job Title:" ${interviewData.jobTitle}"
"Required Level:" ${interviewData.experienceLevel}"
"Job Description:" ${interviewData.jobDescription}"
"Company Description:" ${interviewData.companyDescription}"
"Required Skills:" ${interviewData.requiredSkills}"
"Difficulty Level:" ${interviewData.difficultyLevel}"
"Question Type:" ${interviewData.questionTypes}"
Here is the previous conversation:

${conversation}

Here are relevant past answers from the previous conversation:
${similarAnswers.join("\n")}

Ask a relevant follow-up question in text format.
`;

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

  const savedAIQuestion = await prisma.mockModel.create({
    data: {
      text: data, // AI-generated question
      sender: "interviewer",
      interviewId: interviewData.id,
    },
  });

  return NextResponse.json({
    question: savedAIQuestion.text,
    interviewId: interviewData.id,
  });
}
