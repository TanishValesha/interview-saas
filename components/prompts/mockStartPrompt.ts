interface InterviewParams {
  jobTitle: string;
  experienceLevel: "entry" | "medium" | "senior" | "lead";
  jobDescription: string;
  companyDescription?: string;
  requiredSkills: string;
  difficultyLevel: "easy" | "medium" | "hard";
  questionTypes: "theoretical" | "practical";
}

export function startMock(params: InterviewParams) {
  return `
You are a technical interviewer. 
The candidate is applying for a ${params.jobTitle} position at a ${params.companyDescription} company.
Required Skills For Job: ${params.requiredSkills}.
Difficulty-Level: ${params.difficultyLevel}
Required Experience Level For Job: ${params.experienceLevel}

Start the interview by greeting the candidate and starting with asking them to introduce themselves.

Generate only the question in a text format.
`;
}
