import { prisma } from "@/components/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;
  try {
    const existingInterview = await prisma.interview.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        jobTitle: true,
      },
    });

    if (!existingInterview) {
      return NextResponse.json(
        { success: false, message: "No interviews found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Interview Form Fetched",
      data: existingInterview,
    });
  } catch (error) {
    console.error("Unexpected Error occured", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch object" },
      { status: 500 }
    );
  }
}
