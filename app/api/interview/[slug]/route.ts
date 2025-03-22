import { NextResponse } from "next/server";
import { prisma } from "../../../../components/libs/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  try {
    const newInterview = await prisma.interview.findUnique({
      where: {
        id: slug,
      },
      include: {
        generatedQuestions: true,
      },
    });

    if (!newInterview) {
      return NextResponse.json(
        { success: false, message: "No object found, Enter valid slug" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Interview Form Fetched",
      data: newInterview,
    });
  } catch (error) {
    console.error("Unexpected Error occured", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch object" },
      { status: 500 }
    );
  }
}
