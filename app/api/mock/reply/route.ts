import { NextResponse } from "next/server";
import { prisma } from "@/components/libs/prisma";
// import { startMock } from "@/components/prompts/mockStartPrompt";
import { getInterviewDetails } from "@/components/libs/getInterviewFunction";
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
You are a senior technical interviewer conducting a mock interview.

Job Title: ${interviewData.jobTitle}  
Experience Level: ${interviewData.experienceLevel}  
Company Context: ${interviewData.companyDescription}  
Difficulty Level: ${interviewData.difficultyLevel}  
Required Skills: ${interviewData.requiredSkills}
Question Types: ${interviewData.questionTypes}

Conversation so far:  
${conversation}

Candidate’s previous answers:  
${similarAnswers}

Your task:
- Ask one question at a time.
- Only acknowledge, appreciate or mostly critize the candidate’s recent previous answer with a brief and natural reaction.
- Look into the previously asked questions and ask a follow-up question accordingly.
- If needed, ask a relevant follow-up question to probe deeper.
- Move to a new skill/topic if the current one is sufficiently explored (4-6 questions or solid responses).
- Adjust question complexity to match the candidate’s experience level.
- Prioritize covering all required skills. Track what’s already been discussed.
- Don't repeat questions which are already answered.

If the candidate asks to repeat or clarify a question, respond naturally with:
- "Sure, I was asking..." or  
- "No problem, here's the question again: ..."

Tone:
- Conversational, helpful, and professional.
- Never robotic or overly formal.
- No extra system notes, only direct interviewer responses.

Remember:
- Be human-like, engaging, and natural.
- Use varied sentence structures mentioned above and avoid repetitive phrases.
- Carefully Understand the candidate's responses and respond accordingly.


Current/Recent response by the candidate:
${userAnswer}
`;
  // Randomize personality traits to create variation in interviewer style
  //   const personalities = [
  //     {
  //       name: "Alex",
  //       style: "direct but friendly",
  //       quirk: "occasionally uses sports metaphors",
  //       transitionStyle: "straightforward",
  //     },
  //     {
  //       name: "Jordan",
  //       style: "thoughtful and analytical",
  //       quirk: "brief pauses before key points",
  //       transitionStyle: "connects ideas conceptually",
  //     },
  //     {
  //       name: "Taylor",
  //       style: "enthusiastic and encouraging",
  //       quirk: "uses 'fantastic' and 'interesting' frequently",
  //       transitionStyle: "energetic shifts",
  //     },
  //   ];

  //   // Randomly select personality for this session
  //   const personality =
  //     personalities[Math.floor(Math.random() * personalities.length)];

  //   // Create response variation patterns
  //   const acknowledgments = [
  //     "That's an interesting perspective on ${lastTopic}.",
  //     "I see what you mean about ${lastPoint}.",
  //     "Hmm, I appreciate how you approach ${lastTopic}.",
  //     "That makes sense, especially when considering ${industryContext}.",
  //     "Right, and that's particularly relevant for ${relevantSkill}.",
  //   ];

  //   const transitions = [
  //     "So that leads me to wonder...",
  //     "Building on that idea...",
  //     "That reminds me of another area I wanted to explore...",
  //     "You know, that's connected to...",
  //     "Let's shift gears slightly and talk about...",
  //   ];

  //   const coveredSkills = [];

  //   const prompt = `
  // You are ${interviewData.companyDescription}'s experienced ${
  //     interviewData.jobTitle
  //   } interviewer named ${personality.name}. Your interview style is ${
  //     personality.style
  //   } and ${personality.quirk}. You're interviewing a candidate at the ${
  //     interviewData.experienceLevel
  //   } level.

  // Context from previous conversation: ${
  //     conversation || "This is the start of the interview"
  //   }
  // Insights from candidate's earlier responses: ${
  //     similarAnswers || "No previous responses yet"
  //   }

  // Interview status:
  // - Skills already discussed: ${coveredSkills.join(", ") || "None yet"}
  // - Skills to cover: ${interviewData.requiredSkills}
  // - Current difficulty: ${interviewData.difficultyLevel}
  // - Question focus: ${interviewData.questionTypes}

  // As you continue the interview:
  // 1. Be conversational and human - use contractions, occasional filler words, and varied sentence structures
  // 2. React specifically to something they said in their last answer - don't be generic
  // 3. Use your characteristic ${
  //     personality.transitionStyle
  //   } transitions when changing topics
  // 4. Use the following phrases to acknowledge their last answer:
  //    - ${acknowledgments.join(", ")}
  // 5. Use the following phrases to transition to a new topic:
  //     - ${transitions.join(", ")}
  // 6. Include occasional personal touches like "In my experience..." or "We've found that..."
  // 7. Ask ONE clear question, sometimes with context and sometimes directly
  // 8. Don't label or announce what you're doing - just have a natural conversation

  // Important: Don't follow a rigid formula. Vary your approach between responses. Sometimes be brief, sometimes provide more context. Occasionally reference industry trends or challenges that feel authentic to the role.

  // Respond exactly as a human interviewer would - with personality, authentic reactions, and natural language. No notes, explanations, or meta-commentary about the interview process.
  // `;

  console.log("Prompt for AI:", prompt);

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
