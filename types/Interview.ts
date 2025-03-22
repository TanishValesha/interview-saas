import { Question } from "./Question";

export type Interview = {
  id: string;
  jobTitle: string;
  experienceLevel: string;
  jobDescription: string;
  companyDescription: string;
  requiredSkills: string[];
  difficultyLevel: string;
  generatedQuestions: Question[];
  createdAt: Date;
};
