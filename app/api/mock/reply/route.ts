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

  for (let i = 0; i < previousConvo.length - 1; i++) {
    const question = previousConvo[i];
    const answer = previousConvo[i + 1];

    if (question.sender == "interviewer" && answer.sender == "candidate") {
      conversation += `Question: ${question.text}\n Answer: ${answer.text}\n \n`;
    }
  }

  const prompt = `
You are an experienced interviewer conducting a mock interview for the following position:

Job Title: ${interviewData.jobTitle}
Experience Level: ${interviewData.experienceLevel}
Company: ${interviewData.companyDescription}

If previous conversation exists,
Based on the conversation history: ${conversation}
And the candidate's previous answers: ${similarAnswers}

Ask a natural follow-up question that:

1. Acknowledges their previous answer with a brief reaction
2. Probes deeper if their answer needs more detail
3. Moves to a new relevant topic once sufficient information is provided
4. Adjusts difficulty based on the specified level: ${interviewData.difficultyLevel}
5. Focuses on the required skills: ${interviewData.requiredSkills}
6. Aligns with the question type: ${interviewData.questionTypes}

Move to a new topic from the required skills list if:
   - The current skill topic has been explored through 4-6 questions
   - The candidate has provided thorough responses on the current topic
   - You've spent more than 4-5 exchanges on the same skill area

Required Skills to Cover: ${interviewData.requiredSkills}
(Track which skills have been addressed and prioritize unexplored ones)

If the candidate asks for clarification or repetition, respond briefly and naturally:
   - "Sure, I was asking about..." (then restate the question more concisely)
   - "No problem. My question was..." (then repeat the core question)

Remember to maintain a conversational, human-like tone throughout the interview and no extra notes or anything. Avoid sounding robotic or scripted.
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
