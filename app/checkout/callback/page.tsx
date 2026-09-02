"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

type VerifyResult =
  | { status: "loading" }
  | { status: "paid"; subtotal: number; reference: string }
  | { status: "failed" };

function CheckoutCallbackContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { clearCart } = useCart();
  const [result, setResult] = useState<VerifyResult>({ status: "loading" });

  useEffect(() => {
    async function verify() {
      if (!reference) {
        setResult({ status: "failed" });
        return;
      }

      try {
        const res = await fetch(
          `/api/checkout/verify?reference=${encodeURIComponent(reference)}`,
        );
        const data = await res.json();

        if (data.status === "paid") {
          clearCart();
          setResult({
            status: "paid",
            subtotal: data.order.subtotal,
            reference: data.order.reference,
          });
        } else {
          setResult({ status: "failed" });
        }
      } catch {
        setResult({ status: "failed" });
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (result.status === "loading") {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-muted">Confirming your payment...</p>
      </section>
    );
  }

  if (result.status === "failed") {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Payment not confirmed
        </h1>
        <p className="mt-2 text-muted">
          If money was deducted, contact us with your reference and we&apos;ll
          sort it out.
        </p>
        <Link
          href="/cart"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
        >
          Back to cart
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">
        Payment successful
      </h1>
      <p className="mt-2 text-muted">
        Thank you — your order of {formatPrice(result.subtotal)} has been
        placed.
      </p>
      <p className="mt-1 text-xs text-muted">Reference: {result.reference}</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
      >
        Continue shopping
      </Link>
    </section>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-muted">Confirming your payment...</p>
        </section>
      }
    >
      <CheckoutCallbackContent />
    </Suspense>
  );
}
