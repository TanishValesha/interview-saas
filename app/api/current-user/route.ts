import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User Found",
      data: user,
    });
  } catch (error) {
    console.error("Unexpected Error occured", error);
    return NextResponse.json(
      { success: false, message: "Request Failed" },
      { status: 500 }
    );
  }
}
