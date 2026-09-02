import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (role !== "admin") redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="font-display text-sm font-semibold tracking-tight"
          >
            SLGN Admin
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-muted transition-colors hover:text-accent"
          >
            Back to site
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        <aside className="w-48 shrink-0">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Admin panel
          </p>
          <nav className="mt-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground dark:hover:bg-transparent dark:hover:text-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
