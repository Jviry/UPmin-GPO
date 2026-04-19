export function Footer() {
  return (
    <footer id="forms" className="border-t border-[var(--line)] bg-[var(--page-bg)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-8 text-sm text-[var(--text-secondary)] md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Graduate Programs Office</p>
          <p className="mt-3 max-w-sm">Placeholder footer copy for the office summary, contact details, and fallback text.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Quick Links</p>
          <div className="mt-3 space-y-2">
            <p>Placeholder link one</p>
            <p>Placeholder link two</p>
            <p>Placeholder link three</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Contact</p>
          <div className="mt-3 space-y-2">
            <p>Placeholder address line</p>
            <p>Placeholder email</p>
            <p>Placeholder phone number</p>
          </div>
        </div>
      </div>
    </footer>
  );
}