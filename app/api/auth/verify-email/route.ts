import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { consumeVerificationToken } from "@/lib/tokens";
import { User } from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Missing verification details" },
        { status: 400 },
      );
    }

    const result = await consumeVerificationToken(email, token);

    if (!result.valid) {
      const message =
        result.reason === "expired"
          ? "This verification link has expired, request a new one"
          : "This verification link is invalid";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    await connectToDatabase();
    await User.updateOne(
      { email: email.toLowerCase() },
      { emailVerified: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again" },
      { status: 500 },
    );
  }
}
