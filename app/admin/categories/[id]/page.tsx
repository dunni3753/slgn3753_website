"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  CategoryForm,
  type CategoryFormValues,
} from "@/components/admin/category-form";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialValues, setInitialValues] = useState<CategoryFormValues | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        const category = data.categories?.find(
          (entry: CategoryFormValues & { _id: string }) => entry._id === id,
        );
        if (category) {
          setInitialValues({
            name: category.name,
            slug: category.slug,
            detail: category.detail,
            icon: category.icon,
          });
        }
      });
  }, [id]);

  async function handleUpdate(values: CategoryFormValues) {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Something went wrong" };
    }

    router.push("/admin/categories");
  }

  if (!initialValues) {
    return <p className="text-sm text-muted">Loading category...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit category</h1>
      <div className="mt-6">
        <CategoryForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
