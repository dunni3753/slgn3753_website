import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  await connectToDatabase();
  const product = await Product.findOne({ slug: productSlug }).lean();
  return { title: product ? product.name : "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; productSlug: string }>;
}) {
  const { category: categorySlug, productSlug } = await params;

  await connectToDatabase();

  const [category, product] = await Promise.all([
    Category.findOne({ slug: categorySlug }).lean(),
    Product.findOne({ slug: productSlug, category: categorySlug }).lean(),
  ]);

  if (!category || !product) notFound();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href={`/products/${category.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M15 5l-7 7 7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to {category.name}
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

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
            <AddToCartButton
              product={{
                slug: product.slug,
                category: product.category,
                name: product.name,
                price: product.price,
                stock: product.stock,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
