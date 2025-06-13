// Recommendation enum type
type Recommendation =
  | "MAYBE"
  | "STRONG_HIRE"
  | "HIRE"
  | "NO_HIRE"
  | "STRONG_NO_HIRE";

// Confidence level enum type
type ConfidenceLevel = "BALANCED" | "HIGH" | "LOW";

// Communication style enum type
type CommunicationStyle = "APPROPRIATE" | "EXCELLENT" | "POOR";

// Preparedness level enum type
type PreparednessLevel = "WELL_PREPARED" | "UNDER_PREPARED" | "OVER_PREPARED";

// Category scores structure
interface CategoryScores {
  communication: number;
  technical: number;
  behavioral: number;
  answerQuality: number;
  engagement: number;
  pressureHandling: number;
}

// Strength item structure
interface Strength {
  category: string;
  description: string;
  example: string;
}

// Improvement item structure
interface Improvement {
  category: string;
  issue: string;
  suggestion: string;
  example: string;
}

// Red flag item structure
interface RedFlag {
  concern: string;
  impact: string;
  evidence: string;
}

// Green flag item structure
interface GreenFlag {
  strength: string;
  impact: string;
  evidence: string;
}

// Response quality enum type
type ResponseQuality = "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR";

// Question analysis item structure
interface QuestionAnalysis {
  question: string;
  responseQuality: ResponseQuality;
  whatWorked: string;
  couldImprove: string;
  betterResponse: string;
}

// Next steps structure
interface NextSteps {
  immediate: string[];
  longTerm: string[];
  interviewStrategy: string[];
}

// Main feedback data interface
interface FeedbackData {
  overallScore: number;
  recommendation: Recommendation;
  summary: string;
  categoryScores: CategoryScores;
  strengths: Strength[];
  improvements: Improvement[];
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];
  questionAnalysis: QuestionAnalysis[];
  nextSteps: NextSteps;
  confidenceLevel: ConfidenceLevel;
  communicationStyle: CommunicationStyle;
  preparednessLevel: PreparednessLevel;
}

// Export types for use in other files
export type {
  FeedbackData,
  Recommendation,
  ConfidenceLevel,
  CommunicationStyle,
  PreparednessLevel,
  CategoryScores,
  Strength,
  Improvement,
  RedFlag,
  GreenFlag,
};
