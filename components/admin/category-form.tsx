"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CategoryIcon } from "@/components/category-icon";

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

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    direction: "down" as "down" | "up",
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // ...rest of the component unchanged

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const panelHeight = 256; // matches max-h-64
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const direction: "down" | "up" =
        spaceBelow < panelHeight && spaceAbove > spaceBelow ? "up" : "down";

      setCoords({
        top: direction === "down" ? rect.bottom + 6 : rect.top - 6,
        left: rect.left,
        width: rect.width,
        direction,
      });
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-1.5 flex w-full items-center justify-between rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent cursor-pointer"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-accent">
            <CategoryIcon icon={value} />
          </span>
          {value}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6 -6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && mounted
        ? createPortal(
            <div
              ref={panelRef}
              style={{
                position: "fixed",
                top: coords.direction === "down" ? coords.top : undefined,
                bottom:
                  coords.direction === "up"
                    ? window.innerHeight - coords.top
                    : undefined,
                left: coords.left,
                width: coords.width,
              }}
              className="z-[100] max-h-64 overflow-y-auto rounded-xl border border-line bg-surface shadow-lg"
            >
              <div className="divide-y divide-line">
                {iconOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-background cursor-pointer ${
                      option === value ? "bg-accent/5 text-accent" : ""
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-accent">
                      <CategoryIcon icon={option} />
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

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
        <label className="text-sm font-medium">Icon</label>
        <IconPicker value={icon} onChange={setIcon} />
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
