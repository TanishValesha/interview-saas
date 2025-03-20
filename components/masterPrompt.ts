// import { GoogleGenerativeAI } from "@google/generative-ai";

// Advanced Configuration Types
// interface ModelConfig {
//   temperature: number;
//   topK: number;
//   topP: number;
//   maxOutputTokens: number;
// }

interface InterviewParams {
  jobTitle: string;
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  jobDescription: string;
  companyDescription?: string;
  requiredSkills: string;
  difficultyLevel: "easy" | "medium" | "hard";
}

// Industry Context Definition
// const INDUSTRY_CONTEXTS = {
//   "Software Engineering": {
//     currentChallenges: [
//       "Microservices architecture",
//       "AI/ML integration",
//       "Serverless computing",
//     ],
//     emergingTechnologies: [
//       "Edge computing",
//       "Quantum computing interfaces",
//       "Blockchain scalability",
//     ],
//   },
//   "Data Science": {
//     currentChallenges: [
//       "Ethical AI development",
//       "Model interpretability",
//       "Data privacy",
//     ],
//     emergingTechnologies: [
//       "Federated learning",
//       "Automated machine learning",
//       "Explainable AI frameworks",
//     ],
//   },
// };

// Intelligent Model Configuration Function
// function getModelConfig(complexity: "low" | "medium" | "high"): ModelConfig {
//   const temperatureMap = {
//     low: 0.3, // Precise, factual responses
//     medium: 0.6, // Balanced creativity
//     high: 0.8, // Maximum creativity
//   };

//   return {
//     temperature: temperatureMap[complexity],
//     topK: 50,
//     topP: 0.9,
//     maxOutputTokens: 2048,
//   };
// }

// Prompt Creation Function
export default function createMasterPrompt(params: InterviewParams): string {
  return `
ROLE: Expert Technical Recruiter and Interview Strategist

OBJECTIVE: Generate precise, high-quality interview questions

CONSTRAINTS:
- Job Role: ${params.jobTitle}
- Experience Level: ${params.experienceLevel} years
- Interview Format: Technical Assessment
- Job Description: ${params.jobDescription}
- Company Description: ${params.companyDescription}
- Required Skills: ${params.requiredSkills}
- Difficulty Level: ${params.difficultyLevel}

SPECIALIZED INSTRUCTIONS:
1. Questions must be:
   - Highly specific to ${params.jobTitle}
   - Technically rigorous
   - Capable of revealing true candidate capability
   - Should align with the job description
   - Should test the required skills
   - Difficulty should increase ascendingly


EVALUATION FRAMEWORK FOR EACH QUESTION:
- Technical Depth: Assess comprehensive understanding
- Problem-Solving Approach: Evaluate critical thinking
- Practical Application: Test real-world implementation skills
- Complexity Matching: Align with ${params.experienceLevel} years of experience

OUTPUT FORMAT:
- Only questions should be generated no other text
- Questions should be returned in an array format

Generate 10 in-depth interview questions that go beyond surface-level knowledge.
  `;
}
