import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  await connectToDatabase();

  const products = await Product.find({
    active: true,
    $or: [
      { name: { $regex: query, $options: "i" } },
      { spec: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  })
    .limit(5)
    .lean();

  return NextResponse.json({ products });
}
