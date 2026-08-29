import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { avatarUrl } = await request.json();
  if (!avatarUrl) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  await connectToDatabase();
  const userId = (session.user as { id?: string }).id;
  await User.findByIdAndUpdate(userId, { avatarUrl });

  return NextResponse.json({ success: true, avatarUrl });
}
