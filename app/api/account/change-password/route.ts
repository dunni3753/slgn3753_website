import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { isPasswordStrongEnough } from "@/lib/password";
import { User } from "@/lib/models/User";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  if (!isPasswordStrongEnough(newPassword)) {
    return NextResponse.json(
      {
        error:
          "New password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character",
      },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const userId = (session.user as { id?: string }).id;
  const user = await User.findById(userId);

  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return NextResponse.json({ success: true });
}
