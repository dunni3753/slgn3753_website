"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useCart } from "./cart-provider";

const links = [
  { href: "#cameras", label: "Cameras" },
  { href: "#intercoms", label: "Intercoms" },
  { href: "#fencing", label: "Electric Fence" },
  { href: "#fire-alarm", label: "Fire Alarm" },
  { href: "#automation", label: "Automation" },
  { href: "#contact", label: "Contact" },
];

function CartIcon() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/cart"
      aria-label="View cart"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2 -1.6L21 8H6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </svg>
      {itemCount > 0 ? (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-background">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}

function AccountLink() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div
        className="h-9 w-9 shrink-0 rounded-full border border-line"
        aria-hidden="true"
      />
    );
  }

  const role = (session?.user as { role?: string } | undefined)?.role;
  const avatarUrl = (session?.user as { avatarUrl?: string } | undefined)
    ?.avatarUrl;

  if (session?.user) {
    const initial = session.user.name?.charAt(0).toUpperCase() ?? "A";
    return (
      <div className="flex items-center gap-2">
        {role === "admin" ? (
          <Link
            href="/admin"
            className="hidden rounded-full border border-line px-3 py-1.5 text-xs font-mono text-muted transition-colors hover:border-accent hover:text-accent sm:inline-flex"
          >
            Admin
          </Link>
        ) : null}
        <Link
          href="/account"
          aria-label="Your account"
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line text-sm font-semibold text-foreground transition-colors hover:border-accent"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={session.user.name ?? "Account"}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent sm:inline-flex"
    >
      Log In
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <Image
            src="/logo.png"
            alt="Sniper Lens Global Networks"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain"
            priority
          />
          SLGN
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-mono text-muted sm:flex">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-live" />
            SYSTEM ARMED
          </div>
          <a
            href="#contact"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background sm:inline-flex"
          >
            Get a Quote
          </a>
          <AccountLink />
          <CartIcon />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line md:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              {open ? (
                <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-1 border-t border-line px-6 py-4 text-sm font-medium text-muted md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 transition-colors hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </a>
          ))}

          {!session?.user ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 transition-colors hover:bg-surface hover:text-foreground"
            >
              Log In
            </Link>
          ) : null}

          {role === "admin" ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 transition-colors hover:bg-surface hover:text-foreground"
            >
              Admin
            </Link>
          ) : null}

          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-accent px-4 py-2 text-center font-semibold text-background"
          >
            Get a Quote
          </a>
        </nav>
      ) : null}
    </header>
  );
}
