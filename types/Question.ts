import { Interview } from "./Interview";

export type Question = {
  id: string;
  text: string;
  aiAnswer?: string | null;
  userAnswer?: string | null;
  interviewId: string;
  interview: Interview;
};
