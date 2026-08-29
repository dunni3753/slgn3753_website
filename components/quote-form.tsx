"use client";

import { useState } from "react";

const services = [
  "CCTV cameras",
  "Intercom systems",
  "Electric fencing",
  "Fire alarm systems",
  "Home automation",
  "Security gadgets",
];

export function QuoteForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = {
      fullName: (form.elements.namedItem("fullName") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      serviceType: (form.elements.namedItem("serviceType") as HTMLSelectElement)
        .value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="font-display text-lg font-semibold">Request received</p>
        <p className="mt-2 text-sm text-muted">
          Thank you, our team will reach out to you within one working day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-line bg-surface p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceType" className="text-sm font-medium">
            Service needed
          </label>
          <select
            id="serviceType"
            name="serviceType"
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            required
            placeholder="Area, city"
            className="mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Additional details, optional
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {status === "error" ? (
        <p className="text-sm text-alert">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Sending request..." : "Request a Quote"}
      </button>
    </form>
  );
}
