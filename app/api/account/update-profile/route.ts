import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name } = await request.json();

  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Please enter a valid name" },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const userId = (session.user as { id?: string }).id;
  await User.findByIdAndUpdate(userId, { name: name.trim() });

  return NextResponse.json({ success: true, name: name.trim() });
}
