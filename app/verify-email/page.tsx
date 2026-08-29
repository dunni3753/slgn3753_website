"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const missingParams = !token || !email;

  useEffect(() => {
    if (missingParams) return;

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong, please try again");
      });
  }, [token, email, missingParams]);

  const effectiveStatus = missingParams ? "error" : status;
  const effectiveMessage = missingParams
    ? "This verification link is missing details"
    : message;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-md flex-col items-center justify-center px-6 text-center">
      {effectiveStatus === "loading" ? (
        <>
          <svg
            className="h-8 w-8 animate-spin text-accent"
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
          <p className="mt-4 text-muted">Verifying your email...</p>
        </>
      ) : null}

      {effectiveStatus === "success" ? (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-live/10 text-live">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12.5l4.5 4.5L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">
            Email verified
          </h1>
          <p className="mt-2 text-muted">
            Your account is now active, you can log in.
          </p>
          <Link
            href="/login"
            className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background"
          >
            Go to Log In
          </Link>
        </>
      ) : null}

      {effectiveStatus === "error" ? (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-alert/10 text-alert">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">
            Verification failed
          </h1>
          <p className="mt-2 text-muted">{effectiveMessage}</p>

          {email ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || resent}
              className="mt-6 rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
            >
              {resent
                ? "New link sent"
                : resending
                  ? "Sending..."
                  : "Send a new link"}
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );

  async function handleResend() {
    if (!email) return;
    setResending(true);
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResending(false);
    setResent(true);
  }
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-md flex-col items-center justify-center px-6 text-center">
          <svg
            className="h-8 w-8 animate-spin text-accent"
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
        </section>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
