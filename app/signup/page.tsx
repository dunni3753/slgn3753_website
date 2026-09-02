"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ViewfinderFrame } from "@/components/viewfinder-frame";
import { PasswordStrength } from "@/components/password-strength";
import { isPasswordStrongEnough } from "@/lib/password";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isPasswordStrongEnough(password)) {
      setError("Please choose a stronger password before continuing");
      return;
    }

    setLoading(true);

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password,
    };

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <section className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-line bg-surface lg:block">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-accent/15 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-semibold"
          >
            <Image
              src="/logo.png"
              alt="Sniper Lens Global Networks"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-contain"
            />
            SLGN
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-background/80 px-3 py-1.5 font-mono text-xs text-muted">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-live" />
              Create your account
            </div>

            <h1 className="mt-6 max-w-sm font-display text-3xl font-semibold leading-tight tracking-tight">
              Join a network built on real protection.
            </h1>

            <p className="mt-4 max-w-sm text-muted">
              Sign up to request installations, track orders and manage your
              wallet, all in one place.
            </p>

            <ViewfinderFrame className="mt-10 aspect-[16/10] w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-background">
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <span className="radar-ring absolute h-full w-full rounded-full border border-accent/40" />
                  <span
                    className="radar-ring absolute h-full w-full rounded-full border border-accent/40"
                    style={{ animationDelay: "0.9s" }}
                  />
                  <span
                    className="radar-ring absolute h-full w-full rounded-full border border-accent/40"
                    style={{ animationDelay: "1.8s" }}
                  />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted/60">
                  New account, sector open
                </span>
              </div>

              <style jsx>{`
                .radar-ring {
                  animation: radar-pulse 2.7s ease-out infinite;
                }
                @keyframes radar-pulse {
                  0% {
                    transform: scale(0.3);
                    opacity: 0.8;
                  }
                  100% {
                    transform: scale(1.6);
                    opacity: 0;
                  }
                }
              `}</style>
            </ViewfinderFrame>
          </div>

          <p className="font-mono text-xs text-muted">
            Lagos, Nigeria. Installing nationwide.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 font-display text-lg font-semibold lg:hidden">
            <Image
              src="/logo.png"
              alt="Sniper Lens Global Networks"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-contain"
            />
            SLGN
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            It takes less than a minute.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {success ? (
              <div className="mt-8 rounded-2xl border border-line bg-surface p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path
                      d="M3 7l9 6 9 -6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="mt-4 font-semibold">Check your email</p>
                <p className="mt-1.5 text-sm text-muted">
                  We sent a verification link to your inbox, click it to
                  activate your account.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </label>
                  <div className="relative mt-1.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    >
                      <circle cx="12" cy="8" r="3.5" />
                      <path
                        d="M4.5 20c1.3 -3.5 4.3 -5.5 7.5 -5.5s6.2 2 7.5 5.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      id="name"
                      name="name"
                      required
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <div className="relative mt-1.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path
                        d="M3 7l9 6 9 -6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative mt-1.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    >
                      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
                      <path
                        d="M8 10.5V7a4 4 0 0 1 8 0v3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a strong password"
                      className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-accent"
                    >
                      {showPassword ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path
                            d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M9.3 5.3A10.4 10.4 0 0 1 12 5c5 0 9 4.5 10 7 -0.4 1 -1.2 2.4 -2.4 3.6M6.1 6.9C4 8.4 2.6 10.4 2 12c1 2.5 5 7 10 7 1.3 0 2.6 -0.3 3.7 -0.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path
                            d="M2 12c1 -2.5 5 -7 10 -7s9 4.5 10 7c-1 2.5 -5 7 -10 7s-9 -4.5 -10 -7Z"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>
                {error ? (
                  <p className="flex items-center gap-2 rounded-lg border border-alert/30 bg-alert/5 px-3 py-2 text-sm text-alert">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
                    </svg>
                    {error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 0 1 8 -8V0C5.4 0 0 5.4 0 12h4Z"
                        />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>{" "}
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account,{" "}
            <Link href="/login" className="font-semibold text-accent">
              log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
