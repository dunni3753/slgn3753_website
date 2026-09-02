"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ProductForm,
  type ProductFormValues,
} from "@/components/admin/product-form";

type Product = ProductFormValues & { _id: string };

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      if (!ignore) {
        setProducts(data.products ?? []);
        setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  async function handleCreate(values: ProductFormValues) {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Something went wrong" };
    }

    setShowForm(false);
    setLoading(true);
    setRefreshKey((key) => key + 1);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setLoading(true);
    setRefreshKey((key) => key + 1);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Products</h1>
          <p className="mt-1.5 text-sm text-muted">
            Manage what customers see in your catalogue.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer"
        >
          {showForm ? "Cancel" : "Add product"}
        </button>
      </div>

      {showForm ? (
        <div className="mt-6">
          <ProductForm onSubmit={handleCreate} submitLabel="Create product" />
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-muted">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted">
            No products yet, add your first one above.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-background">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {product.category} · {formatPrice(product.price)}
                  </p>
                  {!product.active ? (
                    <span className="mt-1 inline-block rounded-full border border-alert/30 px-2 py-0.5 text-xs text-alert">
                      Hidden
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${product._id}`}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent hover:text-accent"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product._id)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-alert transition-colors hover:border-alert"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
