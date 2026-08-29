import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories } from "@/constants";
import { getProductsByCategory, formatPrice } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = categories.find((entry) => entry.slug === categorySlug);
  return { title: category ? category.name : "Products" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = categories.find((entry) => entry.slug === categorySlug);
  if (!category) notFound();

  const items = getProductsByCategory(categorySlug);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        {category.detail}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {category.name}
      </h1>

      {items.length === 0 ? (
        <p className="mt-10 text-muted">
          No products listed in this category yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${category.slug}/${product.slug}`}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent"
            >
              <div className="aspect-square rounded-xl border border-line bg-background" />
              <p className="mt-4 font-display text-lg font-semibold">
                {product.name}
              </p>
              <p className="mt-1 text-sm text-muted">{product.spec}</p>
              <p className="mt-3 font-mono text-sm font-semibold">
                {formatPrice(product.price)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
