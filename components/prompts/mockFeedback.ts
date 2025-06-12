interface FeedbackParams {
  jobTitle: string;
  experienceLevel: "entry" | "medium" | "senior" | "lead";
  jobDescription: string;
  companyDescription?: string;
  requiredSkills: string;
  difficultyLevel: "easy" | "medium" | "hard";
  questionTypes: "theoretical" | "practical";
  conversation: string;
}

export default function createFeedbackPrompt(params: FeedbackParams): string {
  return `
ROLE: Expert Interview Coach and Performance Analyst

OBJECTIVE: Generate comprehensive, actionable feedback on interview performance

CONSTRAINTS:
- Job Role: ${params.jobTitle}
- Experience Level: ${params.experienceLevel}
- Interview Type: ${params.questionTypes}
- Job Description: ${params.jobDescription}
- Company Context: ${params.companyDescription || "Not specified"}
- Focus Areas: ${params.requiredSkills || "General assessment"}

CONVERSATION TO ANALYZE:
${params.conversation}

SPECIALIZED INSTRUCTIONS:
Analysis must be:
   - Brutally honest yet constructive
   - Specific with concrete examples from the conversation
   - Actionable with clear improvement strategies
   - Calibrated to ${params.experienceLevel} level expectations
   - Relevant to ${params.jobTitle} role requirements
   - Professional and encouraging in tone

EVALUATION FRAMEWORK:
Assess performance across these dimensions with scores (1-10):

1. COMMUNICATION EFFECTIVENESS
   - Clarity of expression and articulation
   - Professional language usage
   - Response structure and organization
   - Listening skills demonstration

2. TECHNICAL COMPETENCY
   - Depth of knowledge in required areas
   - Problem-solving methodology
   - Use of specific examples and evidence
   - Understanding of industry best practices

3. BEHAVIORAL EXCELLENCE
   - Confidence level and self-presentation
   - Enthusiasm and genuine interest
   - Adaptability to unexpected questions
   - Cultural fit indicators

4. ANSWER QUALITY & RELEVANCE
   - Direct addressing of questions asked
   - Completeness and thoroughness
   - Use of structured frameworks (STAR, etc.)
   - Logical flow and coherence

5. ENGAGEMENT & PROFESSIONALISM
   - Active participation and interaction
   - Quality of questions asked to interviewer
   - Rapport building abilities
   - Overall professional demeanor

6. PRESSURE HANDLING
   - Composure under difficult questions
   - Recovery from mistakes or confusion
   - Honesty about limitations
   - Creative problem-solving approach

OUTPUT FORMAT:
{
  "overallScore": number (1-60),
  "recommendation": "STRONG_HIRE" | "HIRE" | "MAYBE" | "NO_HIRE" | "STRONG_NO_HIRE",
  "summary": "2-3 sentence performance overview",
  "categoryScores": {
    "communication": number,
    "technical": number,
    "behavioral": number,
    "answerQuality": number,
    "engagement": number,
    "pressureHandling": number
  },
  "strengths": [
    {
      "category": string,
      "description": string,
      "example": "specific quote or behavior from conversation"
    }
  ],
  "improvements": [
    {
      "category": string,
      "issue": string,
      "suggestion": string,
      "example": "how they could have answered better"
    }
  ],
  "redFlags": [
    {
      "concern": string,
      "impact": string,
      "evidence": "specific example from conversation"
    }
  ],
  "greenFlags": [
    {
      "strength": string,
      "impact": string,
      "evidence": "specific example from conversation"
    }
  ],
  "questionAnalysis": [
    {
      "question": string,
      "responseQuality": "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR",
      "whatWorked": string,
      "couldImprove": string,
      "betterResponse": "example of improved answer"
    }
  ],
  "nextSteps": {
    "immediate": [string],
    "longTerm": [string],
    "interviewStrategy": [string]
  },
  "roleSpecificFeedback": string,
  "confidenceLevel": "UNDER_CONFIDENT" | "BALANCED" | "OVER_CONFIDENT",
  "communicationStyle": "TOO_FORMAL" | "APPROPRIATE" | "TOO_CASUAL",
  "preparednessLevel": "UNDER_PREPARED" | "WELL_PREPARED" | "OVER_PREPARED"
}

Generate detailed, specific feedback that helps the candidate understand exactly where they stand and how to improve for future interviews.
  `;
}

export { createFeedbackPrompt, type FeedbackParams };
