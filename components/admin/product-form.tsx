"use client";

import { useEffect, useState } from "react";
import { ProductImageUpload } from "@/components/admin/product-image-upload";

export type ProductFormValues = {
  name: string;
  slug: string;
  category: string;
  price: number;
  spec: string;
  description: string;
  stock: number;
  images: string[];
  active: boolean;
};

type CategoryOption = { _id: string; name: string; slug: string };

export function ProductForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => Promise<{ error?: string } | void>;
  submitLabel: string;
}) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? "");
  const [spec, setSpec] = useState(initialValues?.spec ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [stock, setStock] = useState(initialValues?.stock?.toString() ?? "0");
  const [images, setImages] = useState<string[]>(initialValues?.images ?? []);
  const [active, setActive] = useState(initialValues?.active ?? true);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (!ignore) {
        setCategories(data.categories ?? []);
      }
    }

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a category");
      return;
    }

    setLoading(true);

    const result = await onSubmit({
      name,
      slug,
      category,
      price: Number(price),
      spec,
      description,
      stock: Number(stock),
      images,
      active,
    });

    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-line bg-surface p-6"
    >
      <div>
        <label className="text-sm font-medium">Product images</label>
        <div className="mt-1.5">
          <ProductImageUpload images={images} onImagesChange={setImages} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Product name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm font-mono outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option value="">Select a category</option>
            {categories.map((option) => (
              <option key={option._id} value={option.slug}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="text-sm font-medium">
            Price, NGN
          </label>
          <input
            id="price"
            type="number"
            required
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="stock" className="text-sm font-medium">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            required
            min={0}
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="spec" className="text-sm font-medium">
          Short spec
        </label>
        <input
          id="spec"
          required
          value={spec}
          onChange={(event) => setSpec(event.target.value)}
          placeholder="For example, 4MP, 30x optical zoom"
          className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
          className="h-4 w-4 rounded border-line accent-accent"
        />
        Visible to customers
      </label>

      {error ? <p className="text-sm text-alert">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
