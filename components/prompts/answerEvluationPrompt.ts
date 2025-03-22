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
  
  Please provide a concise point-by-point analysis of this answer with:
  
  STRENGTHS:
  - [List 3-5 specific strengths of the answer]
  - Focus on technical accuracy, relevance, structure, and communication style
  - Highlight any particularly impressive points or strategies used
  
  WEAKNESSES:
  - [List 3-5 specific areas for improvement]
  - Identify any missing information, vague statements, or technical inaccuracies
  - Suggest specific ways to strengthen these weak points
  
  FORMAT:
  - Keep each point brief (4-5 sentences)
  - Be specific and actionable in your feedback
  - Only Return with an object with STRENGTHS array containing string and WEAKNESSES array containing string 
  `;
}
