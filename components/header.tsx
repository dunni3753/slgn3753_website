"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useCart } from "./cart-provider";

const productLinks = [
  {
    href: "/products/cameras",
    label: "Cameras",
    detail: "PTZ, dome, bullet and analogue",
  },
  {
    href: "/products/intercoms",
    label: "Intercoms",
    detail: "Video and audio gate units",
  },
  {
    href: "/products/electric-fencing",
    label: "Electric Fence",
    detail: "Energizers and fence wire",
  },
  {
    href: "/products/fire-alarm-systems",
    label: "Fire Alarm",
    detail: "Panels and smoke detectors",
  },
  {
    href: "/products/home-automation",
    label: "Automation",
    detail: "Smart locks and hubs",
  },
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

function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground cursor-pointer"
      >
        Products
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6 -6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-1/2 top-10 z-50 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
          <div className="divide-y divide-line">
            {productLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 transition-colors hover:bg-background"
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted">{item.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
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
          <ProductsDropdown />
          <a
            href="#contact"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
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
          <button
            type="button"
            onClick={() => setMobileProductsOpen((v) => !v)}
            aria-expanded={mobileProductsOpen}
            className="flex items-center justify-between rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface hover:text-foreground cursor-pointer"
          >
            Products
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M6 9l6 6 6 -6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {mobileProductsOpen ? (
            <div className="ml-2 flex flex-col gap-0.5 border-l border-line pl-3">
              {productLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setMobileProductsOpen(false);
                    setOpen(false);
                  }}
                  className="rounded-lg px-2 py-2 transition-colors hover:bg-surface hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}

          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-2 transition-colors hover:bg-surface hover:text-foreground"
          >
            Contact
          </a>

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
