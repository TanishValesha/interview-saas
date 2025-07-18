// app/api/subscribe/route.ts
import { prisma } from "@/components/libs/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  const parsed = schema.safeParse(body);
  console.log(parsed);

  if (!parsed.success) {
    console.log("Triggered");

    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = body;

  try {
    const isPresent = await prisma.subscription.findUnique({
      where: { email },
    });
    if (isPresent) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 }
      );
    }

    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
    //       from: "Intervu <onboarding@resend.dev>",
    //       to: email,
    //       subject: "Thanks for subscribing!",
    const message = `<!DOCTYPE html>
    <html lang="en" style="margin: 0; padding: 0; background-color: #f7f9fc;">
      <head>
        <meta charset="UTF-8" />
        <title>Welcome to Intervu</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f9fc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px;">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <h1 style="color: #111827; margin: 0;">🎯 Welcome to Intervu!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                    <p>Hi there 👋,</p>
                    <p>
                      Thank you for subscribing to <strong>Intervu</strong> — your personal AI-powered interview coach.
                    </p>
                    <p>
                      With real-time mock interviews, intelligent follow-up questions, and support for both <strong>text and audio</strong> formats, we’re here to help you feel confident and ready for any job opportunity.
                    </p>
                    <p>
                      We'll keep you updated with new features, tips, and early access invites as we roll out exciting updates!
                    </p>
                    <p style="margin-top: 30px;">
                      🚀 Stay sharp,<br />
                      <strong>The Intervu Team</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 30px;">
                    <a href="https://yourdomain.com/dashboard" style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                      Start Practicing
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 40px; font-size: 12px; color: #9ca3af; text-align: center;">
                    You’re receiving this email because you signed up on Intervu.<br />
                    <a href="https://yourdomain.com/unsubscribe" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> if you no longer wish to receive updates.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;

    // Optionally: Save email in a database (Supabase, MongoDB, etc.)
    await prisma.subscription.create({ data: { email: email } });

    await transporter.sendMail({
      from: `"Intervu - Your Personal AI Interview Coach, Available 24/7" <${process.env.EMAIL}>`,
      to: email,
      subject: "Thanks for subscribing!",
      html: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
