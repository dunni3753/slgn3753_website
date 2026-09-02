"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Suggestion = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  spec: string;
  price: number;
  images: string[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      if (!trimmedQuery) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `/api/products/suggest?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await res.json();
        setSuggestions(data.products ?? []);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/products/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5 -3.5" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products..."
          className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-accent"
        />
      </form>

      {open && query.trim() ? (
        <div className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
          {loading ? (
            <p className="px-4 py-4 text-sm text-muted">Searching...</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted">
              No products matched &quot;{query}&quot;
            </p>
          ) : (
            <div className="divide-y divide-line">
              {suggestions.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.category}/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-background"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-background">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted">{product.spec}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-semibold">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push(
                `/products/search?q=${encodeURIComponent(query.trim())}`,
              );
            }}
            className="flex w-full items-center justify-center gap-1.5 border-t border-line px-4 py-3 text-xs font-semibold text-accent transition-colors hover:bg-background"
          >
            View all results for &quot;{query}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
