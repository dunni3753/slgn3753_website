import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { CategoryIcon } from "@/components/category-icon";
import { ProductSearch } from "@/components/product-search";

export const metadata = {
  title: "All Products",
};

export default async function ProductsPage() {
  await connectToDatabase();
  const categories = await Category.find().sort({ name: 1 }).lean();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/"
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
        Back to home
      </Link>

      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
        Full catalogue
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Browse everything we offer
      </h1>

      <div className="mt-8 max-w-md">
        <ProductSearch />
      </div>

      {categories.length === 0 ? (
        <p className="mt-10 text-muted">
          Categories will appear here once added from the admin panel.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-accent">
                <CategoryIcon icon={category.icon} />
              </div>
              <p className="mt-4 flex items-center justify-between font-display text-lg font-semibold">
                {category.name}
                <span className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">
                  →
                </span>
              </p>
              <p className="mt-1 text-sm text-muted">{category.detail}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
