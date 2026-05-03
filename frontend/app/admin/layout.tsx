import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-sans">
      
      {/* Admin Top Navigation - Distinct from public site */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b-4 border-[var(--up-gold)] bg-[var(--up-maroon)] px-8 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="rounded-sm bg-[var(--up-gold)] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)]">
            Admin Suite
          </span>
          <h1 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            UPMin GPO
          </h1>
        </div>
        
        <nav className="flex gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          <Link href="/admin" className="transition-colors hover:text-[var(--up-gold)]">Dashboard</Link>
          <Link href="/admin/programs" className="transition-colors hover:text-[var(--up-gold)]">Programs</Link>
          <Link href="/admin/applications" className="transition-colors hover:text-[var(--up-gold)]">Applications</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">Superadmin</div>
            <button className="text-[0.6rem] uppercase tracking-widest text-white/50 hover:text-white hover:underline">Logout</button>
          </div>
          <div className="h-8 w-8 rounded-full border border-[var(--up-gold)] bg-[var(--surface)]"></div>
        </div>
      </header>

      {/* Page Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}