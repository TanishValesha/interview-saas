import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../components/libs/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question Not Found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Questions Found",
      data: question,
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching questions" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();
    const { userAnswer, aiAnswer } = body;

    if (!userAnswer && !aiAnswer) {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400 }
      );
    }
    let updatedQuestion;
    if (userAnswer) {
      updatedQuestion = await prisma.question.update({
        where: { id },
        data: { userAnswer },
      });
    } else {
      updatedQuestion = await prisma.question.update({
        where: { id },
        data: { aiAnswer },
      });
    }

    if (!updatedQuestion) {
      return NextResponse.json(
        { success: false, message: "Failed to update answer" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Answer updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating answer:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update answer" },
      { status: 500 }
    );
  }
}
