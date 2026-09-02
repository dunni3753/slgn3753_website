import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const order = await Order.findOne({ reference });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Already processed — don't double-decrement stock
    if (order.status === "paid") {
      return NextResponse.json({ status: "paid", order });
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
    );
    const verifyData = await verifyRes.json();

    if (verifyData.status && verifyData.data.status === "success") {
      order.status = "paid";
      await order.save();

      // Decrement stock for each purchased item
      for (const item of order.items) {
        await Product.updateOne(
          { slug: item.slug },
          { $inc: { stock: -item.quantity } },
        );
      }

      return NextResponse.json({ status: "paid", order });
    }

    order.status = "failed";
    await order.save();
    return NextResponse.json({ status: "failed", order });
  } catch (err) {
    console.error("[checkout/verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
