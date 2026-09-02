"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Your cart is empty
        </h1>
        <p className="mt-2 text-muted">
          Browse our products and add something to get started.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">Your Cart</h1>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.name}</p>
              <p className="text-sm text-muted">{formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                className="h-8 w-8 rounded-full border border-line text-sm hover:bg-background"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                className="h-8 w-8 rounded-full border border-line text-sm hover:bg-background"
              >
                +
              </button>
            </div>

            <p className="w-24 shrink-0 text-right font-mono text-sm font-semibold">
              {formatPrice(item.price * item.quantity)}
            </p>

            <button
              type="button"
              onClick={() => removeItem(item.slug)}
              className="text-sm text-muted hover:text-red-500"
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold">Subtotal</p>
        <p className="font-mono text-lg font-semibold">
          {formatPrice(subtotal)}
        </p>
      </div>

      <Link
        href="/checkout"
        className="mt-8 block w-full rounded-full bg-accent py-3 text-center text-sm font-semibold text-background hover:opacity-90"
      >
        Proceed to Checkout
      </Link>
    </section>
  );
}
