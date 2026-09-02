"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import type { CartItem } from "@/components/cart-provider";

type CartProduct = Omit<CartItem, "quantity"> & { stock: number };

export function AddToCartButton({ product }: { product: CartProduct }) {
  const { addItem } = useCart();
  const router = useRouter();

  function handleClick() {
    addItem({
      slug: product.slug,
      category: product.category,
      name: product.name,
      price: product.price,
    });
    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={product.stock === 0}
      className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
    >
      Add to Cart
    </button>
  );
}
