import { prisma } from "@/components/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res: Response
) {
  const feedback = await prisma.interview.findUnique({
    where: { id: params.id },
    select: {
      feedback: true,
    },
  });

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  return NextResponse.json({ data: feedback.feedback }, { status: 200 });
}
