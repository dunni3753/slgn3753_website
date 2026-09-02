import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;

    const body = await req.json();
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
      return NextResponse.json(
        { error: "Missing customer details" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Re-fetch real product data — never trust price/name from the client
    const slugs = items.map((i: { slug: string }) => i.slug);
    const products = await Product.find({
      slug: { $in: slugs },
      active: true,
    }).lean();

    const orderItems = items.map((i: { slug: string; quantity: number }) => {
      const product = products.find((p) => p.slug === i.slug);
      if (!product) {
        throw new Error(`Product not found: ${i.slug}`);
      }
      if (i.quantity < 1) {
        throw new Error(`Invalid quantity for ${product.name}`);
      }
      if (product.stock < i.quantity) {
        throw new Error(`${product.name} only has ${product.stock} in stock`);
      }
      return {
        slug: product.slug,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.images?.[0] ?? "",
        quantity: i.quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0,
    );

    const reference = `slgn_${randomUUID()}`;

    await Order.create({
      userId: userId ?? undefined,
      reference,
      items: orderItems,
      subtotal,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      status: "pending",
    });

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/callback`;

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: Math.round(subtotal * 100), // Paystack expects kobo
          reference,
          callback_url: callbackUrl,
        }),
      },
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      await Order.updateOne({ reference }, { status: "failed" });
      return NextResponse.json(
        { error: paystackData.message ?? "Payment initialization failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      authorizationUrl: paystackData.data.authorization_url,
    });
  } catch (err) {
    console.error("[checkout/initialize]", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
