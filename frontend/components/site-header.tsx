const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Forms", href: "#forms" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(255,255,255,0.92)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <a href="#home" className="flex items-center gap-3 text-[var(--text-primary)]">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-muted)] text-[11px] font-semibold tracking-[0.35em] text-[var(--text-muted)]">
            LOGO
          </span>
          <div className="leading-tight">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--text-muted)]">University Name</p>
            <p className="text-sm font-semibold">Graduate Programs Office</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.22em] text-[var(--text-muted)] md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="transition-colors duration-200 hover:text-[var(--text-primary)]">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#forms"
          className="inline-flex items-center justify-center rounded-full border border-[var(--text-primary)] bg-[var(--text-primary)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          Apply Now
        </a>
      </div>
    </header>
  );
}