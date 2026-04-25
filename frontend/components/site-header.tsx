import Image from 'next/image';

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-gpo" },
  { label: "Programs", href: "/#programs" },
  { label: "Forms", href: "/#forms" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(255,255,255,0.92)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <a href="/" className="flex items-center gap-3 text-[var(--text-primary)]">
          <Image
            src="/Unibersidad_ng_Pilipinas_Mindanao.png"
            alt="University of the Philippines Mindanao"
            width={44}
            height={44}
            className="rounded-full"
            style={{ width: 44, height: 'auto' }}
          />
          <div className="leading-tight">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--text-muted)]">University of the Philippines - Mindanao</p>
            <p className="text-sm font-semibold">Graduate Programs Office</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.22em] text-[var(--text-muted)] md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="transition-colors duration-200 hover:text-[var(--up-maroon)]">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#forms"
          className="inline-flex items-center justify-center rounded-full border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#5c0709] hover:border-[#5c0709]"
        >
          Apply Now
        </a>
      </div>
    </header>
  );
}