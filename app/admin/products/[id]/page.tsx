"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ProductForm,
  type ProductFormValues,
} from "@/components/admin/product-form";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialValues, setInitialValues] = useState<ProductFormValues | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    async function fetchProduct() {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      const product = data.products?.find(
        (entry: ProductFormValues & { _id: string }) => entry._id === id,
      );
      if (product && !ignore) {
        setInitialValues({
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: product.price,
          spec: product.spec,
          description: product.description,
          stock: product.stock,
          images: product.images,
          active: product.active,
        });
      }
    }

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleUpdate(values: ProductFormValues) {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Something went wrong" };
    }

    router.push("/admin/products");
  }

  if (!initialValues) {
    return <p className="text-sm text-muted">Loading product...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit product</h1>
      <div className="mt-6">
        <ProductForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
