import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email/send-verification-email";
import { User } from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && !user.emailVerified) {
      const token = await createVerificationToken(email);
      await sendVerificationEmail(email, user.name, token);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again" },
      { status: 500 },
    );
  }
}
