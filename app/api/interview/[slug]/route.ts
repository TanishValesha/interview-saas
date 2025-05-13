import { NextResponse } from "next/server";
import { prisma } from "../../../../components/libs/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res: Response
) {
  const { slug } = await params;
  try {
    const newInterview = await prisma.interview.findUnique({
      where: {
        id: slug,
      },
      select: {
        id: true,
        jobTitle: true,
        experienceLevel: true,
        jobDescription: true,
        companyDescription: true,
        requiredSkills: true,
        difficultyLevel: true,
        questionTypes: true,
        userId: true,
        generatedQuestions: {
          select: {
            id: true,
            text: true,
          },
        },
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
