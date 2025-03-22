/*
  Warnings:

  - Added the required column `interviewId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "interviewId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "companyDescription" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "difficultyLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
