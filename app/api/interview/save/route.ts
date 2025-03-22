import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../components/libs/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobTitle,
      experienceLevel,
      jobDescription,
      companyDescription,
      requiredSkills,
      difficultyLevel,
    } = body;

    const newInterview = await prisma.interview.create({
      data: {
        jobTitle: jobTitle,
        experienceLevel: experienceLevel,
        jobDescription: jobDescription,
        companyDescription: companyDescription,
        requiredSkills: requiredSkills,
        difficultyLevel: difficultyLevel,
      },
    });

    if (!newInterview) {
      return NextResponse.json(
        { success: false, message: "Failed to create interview form" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Interview Form Created",
      data: newInterview,
    });
  } catch (error) {
    console.error("Unexpected Error occured", error);
    return NextResponse.json(
      { success: false, message: "Failed to update/create destination" },
      { status: 500 }
    );
  }
}
