import { NextResponse } from "next/server";
import { prisma } from "../../../../components/libs/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res: Response
) {
  const { id } = await params;
  try {
    const mockQuestions = await prisma.interview.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        mockQuestions: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            text: true,
            sender: true,
          },
        },
      },
    });

    if (!mockQuestions) {
      return NextResponse.json(
        { success: false, message: "No object found, Enter valid id" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Interview Form Fetched",
      data: mockQuestions,
    });
  } catch (error) {
    console.error("Unexpected Error occured", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch object" },
      { status: 500 }
    );
  }
}
