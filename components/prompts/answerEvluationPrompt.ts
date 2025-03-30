export function createAnswerEvaluationPrompt(
  question: string,
  userAnswer: string,
  level: string
): string {
  return `You are an expert interview coach with deep knowledge in tech, business, and various professional fields. Evaluate the following interview answer based on the question.

  Evaluation Level: "${level}"
  
  Original Question: "${question}"
  
  Candidate's Answer: 
  """
  ${userAnswer}
  """
  
  Please provide a concise point-by-point analysis of this answer with clear strengths, weaknesses, improvments and rating of the answer out of 5.
  
  FORMAT:
  - For each strength and weakness, provide a brief and a detailed description
  - The strength, weakness and improvemnets should be easy to understand and in simple language no fancy words
  - Generate detailed and possible improvments for the candidate
  - Be specific and actionable in your feedback
  - Return ONLY a valid JavaScript object with the following structure and with no uncessary characters/content:
  
  {
    strengths: [s
      "",
      "",
      // Additional strengths following same format
    ],
    weaknesses: [
      "The candidate should ...." ,
      "The answer is",
      // Additional weaknesses following same format
    ],
    rating: "answerRating"
  }
  
  Identify possible strengths focusing on technical accuracy, relevance, structure, and communication style.
  Identify possible weaknesses to improve answer focusing on missing information, vague statements, or technical inaccuracies.
  Provide much more improvements/weaknesses so that the candidate can improve using those points.
  `;
}
