import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "admin";
}

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, slug, detail, icon } = await request.json();

    if (!name || !slug || !detail) {
      return NextResponse.json(
        { error: "Name, slug and detail are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 },
      );
    }

    const category = await Category.create({
      name,
      slug,
      detail,
      icon: icon || "camera",
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
