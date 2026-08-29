import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Quote } from "@/lib/models/Quote";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, serviceType, location, message } = body;

    if (!fullName || !phone || !email || !serviceType || !location) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const quote = await Quote.create({
      fullName,
      phone,
      email,
      serviceType,
      location,
      message,
    });

    return NextResponse.json({ success: true, id: quote._id }, { status: 201 });
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again" },
      { status: 500 },
    );
  }
}
