"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, itemCount } = useCart();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
  });
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user && !prefilled) {
      setForm((current) => ({
        ...current,
        customerName: session.user?.name ?? current.customerName,
        customerEmail: session.user?.email ?? current.customerEmail,
      }));
      setPrefilled(true);
    }
  }, [status, session, prefilled]);

  if (itemCount === 0) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-muted">Your cart is empty.</p>
      </section>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
          })),
          ...form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">Checkout</h1>

      {status === "authenticated" ? (
        <p className="mt-1.5 text-sm text-muted">
          Checking out as {session?.user?.email}
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {itemCount} item{itemCount > 1 ? "s" : ""}
          </span>
          <span className="font-mono font-semibold">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={form.customerEmail}
            onChange={(e) =>
              setForm({ ...form, customerEmail: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <input
            required
            value={form.customerPhone}
            onChange={(e) =>
              setForm({ ...form, customerPhone: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Delivery Address</label>
          <textarea
            required
            rows={3}
            value={form.deliveryAddress}
            onChange={(e) =>
              setForm({ ...form, deliveryAddress: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {error ? <p className="text-sm text-alert">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Redirecting to payment..."
            : `Pay ${formatPrice(subtotal)}`}
        </button>
      </form>
    </section>
  );
}
