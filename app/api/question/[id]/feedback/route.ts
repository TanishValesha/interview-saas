import { prisma } from "@/components/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res: Response
) {
  const { id } = await params;
  const { feedback } = await request.json();

  if (!feedback) {
    return NextResponse.json(
      { error: "Feedback is required" },
      { status: 400 }
    );
  }

  const updated = await prisma.question.update({
    where: { id },
    data: { feedback },
  });

  return NextResponse.json({
    success: true,
    message: "Feedback updated successfully",
    data: updated,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res: Response
) {
  try {
    const feedback = await prisma.question.findUnique({
      where: {
        id: params.id,
      },
      select: {
        feedback: true,
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Feedback Not Found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback Found",
      data: feedback,
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching questions" },
      { status: 500 }
    );
  }
}
