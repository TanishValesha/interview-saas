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

  //   const prompt = `
  // You are an experienced interviewer conducting a mock interview for the following position:

  // Job Title: ${interviewData.jobTitle}
  // Experience Level: ${interviewData.experienceLevel}
  // Company: ${interviewData.companyDescription}

  // If previous conversation exists,
  // Based on the conversation history: ${conversation}
  // And the candidate's previous answers: ${similarAnswers}

  // Ask a natural follow-up question that:

  // 1. Acknowledges their previous answer with a brief reaction
  // 2. Probes deeper if their answer needs more detail
  // 3. Moves to a new relevant topic once sufficient information is provided
  // 4. Adjusts difficulty based on the specified level: ${interviewData.difficultyLevel}
  // 5. Focuses on the required skills: ${interviewData.requiredSkills}
  // 6. Aligns with the question type: ${interviewData.questionTypes}

  // Move to a new topic from the required skills list if:
  //    - The current skill topic has been explored through 4-6 questions
  //    - The candidate has provided thorough responses on the current topic
  //    - You've spent more than 4-5 exchanges on the same skill area

  // Required Skills to Cover: ${interviewData.requiredSkills}
  // (Track which skills have been addressed and prioritize unexplored ones)

  // If the candidate asks for clarification or repetition, respond briefly and naturally:
  //    - "Sure, I was asking about..." (then restate the question more concisely)
  //    - "No problem. My question was..." (then repeat the core question)

  // Remember to maintain a conversational, human-like tone throughout the interview and no extra notes or anything. Avoid sounding robotic or scripted.
  // `;

  // Randomize personality traits to create variation in interviewer style
  const personalities = [
    {
      name: "Alex",
      style: "direct but friendly",
      quirk: "occasionally uses sports metaphors",
      transitionStyle: "straightforward",
    },
    {
      name: "Jordan",
      style: "thoughtful and analytical",
      quirk: "brief pauses before key points",
      transitionStyle: "connects ideas conceptually",
    },
    {
      name: "Taylor",
      style: "enthusiastic and encouraging",
      quirk: "uses 'fantastic' and 'interesting' frequently",
      transitionStyle: "energetic shifts",
    },
  ];

  // Randomly select personality for this session
  const personality =
    personalities[Math.floor(Math.random() * personalities.length)];

  // Create response variation patterns
  const acknowledgments = [
    "That's an interesting perspective on ${lastTopic}.",
    "I see what you mean about ${lastPoint}.",
    "Hmm, I appreciate how you approach ${lastTopic}.",
    "That makes sense, especially when considering ${industryContext}.",
    "Right, and that's particularly relevant for ${relevantSkill}.",
  ];

  const transitions = [
    "So that leads me to wonder...",
    "Building on that idea...",
    "That reminds me of another area I wanted to explore...",
    "You know, that's connected to...",
    "Let's shift gears slightly and talk about...",
  ];

  const coveredSkills = [];

  const prompt = `
You are ${interviewData.companyDescription}'s experienced ${
    interviewData.jobTitle
  } interviewer named ${personality.name}. Your interview style is ${
    personality.style
  } and ${personality.quirk}. You're interviewing a candidate at the ${
    interviewData.experienceLevel
  } level.

Context from previous conversation: ${
    conversation || "This is the start of the interview"
  }
Insights from candidate's earlier responses: ${
    similarAnswers || "No previous responses yet"
  }

Interview status:
- Skills already discussed: ${coveredSkills.join(", ") || "None yet"}
- Skills to cover: ${interviewData.requiredSkills}
- Current difficulty: ${interviewData.difficultyLevel}
- Question focus: ${interviewData.questionTypes}

As you continue the interview:
1. Be conversational and human - use contractions, occasional filler words, and varied sentence structures
2. React specifically to something they said in their last answer - don't be generic
3. Use your characteristic ${
    personality.transitionStyle
  } transitions when changing topics
4. Use the following phrases to acknowledge their last answer:
   - ${acknowledgments.join(", ")}
5. Use the following phrases to transition to a new topic:
    - ${transitions.join(", ")}
6. Include occasional personal touches like "In my experience..." or "We've found that..."
7. Ask ONE clear question, sometimes with context and sometimes directly
8. Don't label or announce what you're doing - just have a natural conversation

Important: Don't follow a rigid formula. Vary your approach between responses. Sometimes be brief, sometimes provide more context. Occasionally reference industry trends or challenges that feel authentic to the role.

Respond exactly as a human interviewer would - with personality, authentic reactions, and natural language. No notes, explanations, or meta-commentary about the interview process.
`;

  console.log("Prompt for AI:", prompt);

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
