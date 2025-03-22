-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "aiAnswer" TEXT,
    "userAnswer" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
