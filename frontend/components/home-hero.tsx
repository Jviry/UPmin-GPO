export function HomeHero() {
  return (
    <section id="home" className="relative isolate h-[calc(100dvh-var(--header-height))] overflow-hidden bg-[var(--hero-bg)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),rgba(0,0,0,0.65))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.65))]" />

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-4 py-16 sm:px-6 lg:px-10">
        <div className="max-w-4xl">
          <div className="mb-8 flex flex-col items-start gap-8 md:flex-row md:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.12)] text-sm font-semibold tracking-[0.4em] text-white md:h-36 md:w-36">
              LOGO
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.4em] text-[rgba(255,255,255,0.72)]">Placeholder Office Tagline</p>
              <h1 className="max-w-3xl font-[var(--font-display)] text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Graduate Programs Office
              </h1>
            </div>
          </div>

          <p className="max-w-2xl border-l border-[rgba(255,255,255,0.45)] pl-4 text-sm leading-7 text-[rgba(255,255,255,0.84)] sm:text-base">
            Placeholder hero copy for the office introduction. This area will eventually carry the real message, imagery, and branding.
          </p>
        </div>
      </div>
    </section>
  );
}