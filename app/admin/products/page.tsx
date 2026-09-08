"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ProductForm,
  type ProductFormValues,
} from "@/components/admin/product-form";
import { Dialog } from "@/components/ui/dialog";

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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

    setShowCreateDialog(false);
    setLoading(true);
    setRefreshKey((key) => key + 1);
  }

  async function handleUpdate(values: ProductFormValues) {
    if (!editingProduct) return;

    const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Something went wrong" };
    }

    setEditingProduct(null);
    setLoading(true);
    setRefreshKey((key) => key + 1);
  }

  async function handleDelete() {
    if (!deletingProduct) return;

    setIsDeleting(true);
    try {
      await fetch(`/api/admin/products/${deletingProduct._id}`, {
        method: "DELETE",
      });
      setDeletingProduct(null);
      setLoading(true);
      setRefreshKey((key) => key + 1);
    } finally {
      setIsDeleting(false);
    }
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
          onClick={() => setShowCreateDialog(true)}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer"
        >
          Add product
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <p className="col-span-full text-sm text-muted">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="col-span-full text-sm text-muted">
            No products yet, add your first one above.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="aspect-square w-full overflow-hidden bg-background">
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="font-semibold leading-snug">{product.name}</p>
                <p className="text-sm text-muted">
                  {product.category} · {formatPrice(product.price)}
                </p>
                {!product.active ? (
                  <span className="mt-1 inline-block w-fit rounded-full border border-alert/30 px-2 py-0.5 text-xs text-alert">
                    Hidden
                  </span>
                ) : null}

                <div className="mt-auto flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 rounded-full border border-line px-3 py-1.5 text-center text-xs font-semibold transition-colors hover:border-accent hover:text-accent cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingProduct(product)}
                    className="flex-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-alert transition-colors hover:border-alert cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Add product"
      >
        <ProductForm onSubmit={handleCreate} submitLabel="Create product" />
      </Dialog>

      <Dialog
        open={editingProduct !== null}
        onClose={() => setEditingProduct(null)}
        title="Edit product"
      >
        {editingProduct ? (
          <ProductForm
            key={editingProduct._id}
            initialValues={editingProduct}
            onSubmit={handleUpdate}
            submitLabel="Save changes"
          />
        ) : null}
      </Dialog>

      <Dialog
        open={deletingProduct !== null}
        onClose={() => {
          if (!isDeleting) setDeletingProduct(null);
        }}
        title="Delete product"
      >
        {deletingProduct ? (
          <div>
            <p className="text-sm text-muted">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deletingProduct.name}
              </span>
              ? This cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-full bg-alert px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
