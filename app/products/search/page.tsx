import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { formatPrice } from "@/lib/format";
import { ProductSearch } from "@/components/product-search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  await connectToDatabase();

  const results = query
    ? await Product.find({
        active: true,
        $or: [
          { name: { $regex: query, $options: "i" } },
          { spec: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }).lean()
    : [];

  console.log("query", query);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/#catalogue"
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
        Back to catalogue
      </Link>

      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
        Search results
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        {query ? `"${query}"` : "Search products"}
      </h1>

      <div className="mt-8 max-w-md">
        <ProductSearch />
      </div>

      {query && results.length === 0 ? (
        <p className="mt-10 text-muted">No products matched your search.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.category}/${product.slug}`}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent"
            >
              <div className="aspect-square overflow-hidden rounded-xl border border-line bg-background">
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
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
