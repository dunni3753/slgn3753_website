"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CategoryForm,
  type CategoryFormValues,
} from "@/components/admin/category-form";

type Category = CategoryFormValues & { _id: string };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (!ignore) {
        setCategories(data.categories ?? []);
        setLoading(false);
      }
    }

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  async function handleCreate(values: CategoryFormValues) {
    const response = await fetch("/api/admin/categories", {
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
    if (!confirm("Delete this category? This cannot be undone.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setLoading(true);
    setRefreshKey((key) => key + 1);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Categories</h1>
          <p className="mt-1.5 text-sm text-muted">
            Manage the categories customers browse by.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer"
        >
          {showForm ? "Cancel" : "Add category"}
        </button>
      </div>

      {showForm ? (
        <div className="mt-6">
          <CategoryForm onSubmit={handleCreate} submitLabel="Create category" />
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-muted">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted">
            No categories yet, add your first one above.
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4"
            >
              <div>
                <p className="font-semibold">{category.name}</p>
                <p className="mt-0.5 text-sm text-muted">{category.detail}</p>
                <p className="mt-0.5 font-mono text-xs text-muted">
                  /{category.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/categories/${category._id}`}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent hover:text-accent"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(category._id)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-alert transition-colors hover:border-alert cursor-pointer"
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
