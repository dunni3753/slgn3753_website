export function ViewfinderFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute -top-px -left-px h-5 w-5 border-t-2 border-l-2 border-accent" />
      <span className="pointer-events-none absolute -top-px -right-px h-5 w-5 border-t-2 border-r-2 border-accent" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-accent" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-accent" />
      {children}
    </div>
  );
}
