"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { ViewfinderFrame } from "@/components/viewfinder-frame";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resent, setResent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error === "email_not_verified") {
      setUnverifiedEmail(email);
      setLoading(false);
      return;
    }

    if (result?.error) {
      setError("Incorrect email or password");
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
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
              Welcome back
            </div>

            <h1 className="mt-6 max-w-sm font-display text-3xl font-semibold leading-tight tracking-tight">
              Everything you need to secure your space, in one account.
            </h1>

            <p className="mt-4 max-w-sm text-muted">
              Track your orders, manage your wallet and request new
              installations, all from one dashboard.
            </p>

            <ViewfinderFrame className="mt-10 aspect-[16/10] w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-background">
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <span className="lock-glow absolute h-full w-full rounded-full bg-accent/20 blur-md" />
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="relative text-accent"
                  >
                    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
                    <path
                      d="M8 10.5V7a4 4 0 0 1 8 0v3.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="15"
                      r="1.4"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted/60">
                  Sector secured
                </span>
              </div>

              <style jsx>{`
                .lock-glow {
                  animation: lock-breathe 3s ease-in-out infinite;
                }
                @keyframes lock-breathe {
                  0%,
                  100% {
                    opacity: 0.25;
                    transform: scale(0.9);
                  }
                  50% {
                    opacity: 0.55;
                    transform: scale(1.05);
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
            Log in
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Enter your details to access your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
              </div>
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
                  <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" strokeLinecap="round" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
            {unverifiedEmail ? (
              <div className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5 text-sm">
                <p className="text-foreground">
                  Please verify your email before logging in.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await fetch("/api/auth/resend-verification", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: unverifiedEmail }),
                    });
                    setResent(true);
                  }}
                  disabled={resent}
                  className="mt-1.5 font-semibold text-accent disabled:opacity-60"
                >
                  {resent
                    ? "New link sent, check your inbox"
                    : "Resend verification email"}
                </button>
              </div>
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
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account,{" "}
            <Link href="/signup" className="font-semibold text-accent">
              sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
