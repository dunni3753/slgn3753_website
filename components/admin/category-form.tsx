"use client";

import { useState } from "react";

export type CategoryFormValues = {
  name: string;
  slug: string;
  detail: string;
  icon: string;
};

const iconOptions = [
  "camera",
  "intercom",
  "fence",
  "fire",
  "automation",
  "access",
  "smartlock",
  "battery",
  "networks",
  "power",
  "gadget",
  "solar",
  "inverter",
  "bulb",
  "solarfan",
  "electronics",
  "dvr",
  "television",
];

export function CategoryForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => Promise<{ error?: string } | void>;
  submitLabel: string;
}) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [detail, setDetail] = useState(initialValues?.detail ?? "");
  const [icon, setIcon] = useState(initialValues?.icon ?? "camera");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const result = await onSubmit({ name, slug, detail, icon });

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
        <label htmlFor="name" className="text-sm font-medium">
          Category name
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
        <p className="mt-1 text-xs text-muted">
          Used in the URL, for example /products/{slug || "your-slug"}
        </p>
      </div>

      <div>
        <label htmlFor="detail" className="text-sm font-medium">
          Short description
        </label>
        <input
          id="detail"
          required
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          placeholder="For example, PTZ, dome, bullet and analogue"
          className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="icon" className="text-sm font-medium">
          Icon
        </label>
        <select
          id="icon"
          value={icon}
          onChange={(event) => setIcon(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          {iconOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

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
