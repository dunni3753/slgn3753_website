import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories } from "@/constants";
import { getProduct, formatPrice, products } from "@/lib/products";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function generateStaticParams() {
  return products.map((product) => ({
    category: product.category,
    productSlug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; productSlug: string }>;
}): Promise<Metadata> {
  const { category, productSlug } = await params;
  const product = getProduct(category, productSlug);
  return { title: product ? product.name : "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; productSlug: string }>;
}) {
  const { category: categorySlug, productSlug } = await params;
  const category = categories.find((entry) => entry.slug === categorySlug);
  const product = getProduct(categorySlug, productSlug);

  if (!category || !product) notFound();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="aspect-square rounded-2xl border border-line bg-surface" />

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {category.name}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="mt-2 text-muted">{product.spec}</p>
          <p className="mt-6 font-mono text-2xl font-semibold">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 leading-relaxed text-muted">
            {product.description}
          </p>

          <p className="mt-6 text-sm text-muted">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Currently out of stock"}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}
