"use client";

import { useEffect, useState } from "react";
import {
  CategoryForm,
  type CategoryFormValues,
} from "@/components/admin/category-form";
import { CategoryIcon } from "@/components/category-icon";
import { Dialog } from "@/components/ui/dialog";

type Category = CategoryFormValues & { _id: string };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
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

    setShowCreateDialog(false);
    setLoading(true);
    setRefreshKey((key) => key + 1);
  }

  async function handleUpdate(values: CategoryFormValues) {
    if (!editingCategory) return;

    const response = await fetch(
      `/api/admin/categories/${editingCategory._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );
    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Something went wrong" };
    }

    setEditingCategory(null);
    setLoading(true);
    setRefreshKey((key) => key + 1);
  }

  async function handleDelete() {
    if (!deletingCategory) return;

    setIsDeleting(true);
    try {
      await fetch(`/api/admin/categories/${deletingCategory._id}`, {
        method: "DELETE",
      });
      setDeletingCategory(null);
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
          <h1 className="font-display text-2xl font-semibold">Categories</h1>
          <p className="mt-1.5 text-sm text-muted">
            Manage the categories customers browse by.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateDialog(true)}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer"
        >
          Add category
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <p className="col-span-full text-sm text-muted">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="col-span-full text-sm text-muted">
            No categories yet, add your first one above.
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-accent">
                <CategoryIcon icon={category.icon} />
              </div>

              <p className="mt-4 font-semibold leading-snug">{category.name}</p>
              <p className="mt-1 text-sm text-muted">{category.detail}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                /{category.slug}
              </p>

              <div className="mt-auto flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCategory(category)}
                  className="flex-1 rounded-full border border-line px-3 py-1.5 text-center text-xs font-semibold transition-colors hover:border-accent hover:text-accent cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingCategory(category)}
                  className="flex-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-alert transition-colors hover:border-alert cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        title="Add category"
      >
        <CategoryForm onSubmit={handleCreate} submitLabel="Create category" />
      </Dialog>

      <Dialog
        open={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        title="Edit category"
      >
        {editingCategory ? (
          <CategoryForm
            key={editingCategory._id}
            initialValues={editingCategory}
            onSubmit={handleUpdate}
            submitLabel="Save changes"
          />
        ) : null}
      </Dialog>

      <Dialog
        open={deletingCategory !== null}
        onClose={() => {
          if (!isDeleting) setDeletingCategory(null);
        }}
        title="Delete category"
      >
        {deletingCategory ? (
          <div>
            <p className="text-sm text-muted">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deletingCategory.name}
              </span>
              ? This cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
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
