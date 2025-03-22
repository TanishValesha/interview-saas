import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../components/libs/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions, interviewId } = body;

    // Validate input
    if (!interviewId || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Save all questions
    const newQuestion = await prisma.question.createMany({
      data: questions.map((questionText: string) => ({
        interviewId,
        text: questionText,
      })),
    });

    if (!newQuestion) {
      return NextResponse.json(
        { success: false, message: "Failed to create questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Questions saved successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while saving questions" },
      { status: 500 }
    );
  }
}
