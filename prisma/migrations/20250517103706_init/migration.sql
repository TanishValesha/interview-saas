-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('interviewer', 'candidate');

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "companyDescription" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "difficultyLevel" TEXT NOT NULL,
    "questionTypes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "aiAnswer" TEXT,
    "userAnswer" TEXT,
    "feedback" JSONB,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockModel" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sender" "Sender" NOT NULL,
    "interviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerEmbedding" (
    "id" TEXT NOT NULL,
    "answerText" TEXT NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "mockModelId" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnswerEmbedding_mockModelId_key" ON "AnswerEmbedding"("mockModelId");

-- CreateIndex
CREATE INDEX "AnswerEmbedding_interviewId_idx" ON "AnswerEmbedding"("interviewId");

-- CreateIndex
CREATE INDEX "AnswerEmbedding_mockModelId_idx" ON "AnswerEmbedding"("mockModelId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_email_key" ON "Subscription"("email");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockModel" ADD CONSTRAINT "MockModel_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerEmbedding" ADD CONSTRAINT "AnswerEmbedding_mockModelId_fkey" FOREIGN KEY ("mockModelId") REFERENCES "MockModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerEmbedding" ADD CONSTRAINT "AnswerEmbedding_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
