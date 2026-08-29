const columns = [
  {
    title: "Products",
    links: [
      "PTZ cameras",
      "Dome cameras",
      "Bullet cameras",
      "Analogue cameras",
      "Intercom devices",
    ],
  },
  {
    title: "Systems",
    links: [
      "Electric fencing",
      "Fire alarm systems",
      "Home automation",
      "Access control",
      "Security gadgets",
    ],
  },
  {
    title: "Company",
    links: ["About us", "Installations", "Support", "Careers", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-semibold">
              Sniper Lens Global Networks
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Selling, repairing and installing CCTV cameras, intercoms,
              electric fencing, fire alarm systems and home automation devices,
              with support that keeps every system running.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-foreground/80 transition-colors hover:text-accent"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sniper Lens Global Networks. All rights reserved.</p>
          <p className="font-mono">Lagos, Nigeria. Installing nationwide.</p>
        </div>
      </div>
    </footer>
  );
}
