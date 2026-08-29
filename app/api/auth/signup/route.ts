import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { createVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email/send-verification-email";
import { User } from "@/lib/models/User";
import { isPasswordStrongEnough } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!isPasswordStrongEnough(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "customer",
      emailVerified: false,
    });

    const token = await createVerificationToken(email);
    await sendVerificationEmail(email, name, token);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again" },
      { status: 500 },
    );
  }
}
