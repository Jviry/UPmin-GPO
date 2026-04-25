import Image from 'next/image';

export function HomeHero() {
  return (
    <section
      id="home"
      className="relative isolate h-[calc(100dvh-var(--header-height))] overflow-hidden border-b-4 border-[var(--up-gold)] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-section-background.jpg')", backgroundColor: 'var(--hero-bg)' }}
    >
      {/* Dark overlay — sits over the background photo */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.55)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.60)_100%)]" />

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-4 py-16 sm:px-6 lg:px-10">
        <div className="max-w-4xl">
          <div className="mb-8 flex flex-col items-start gap-8 md:flex-row md:items-center">
            <Image
              src="/Unibersidad_ng_Pilipinas_Mindanao.png"
              alt="University of the Philippines Mindanao"
              width={144}
              height={144}
              className="object-contain"
              style={{ width: 144, height: 'auto' }}
            />
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.4em] text-[rgba(255,255,255,0.72)]">Placeholder Office Tagline</p>
              <h1 className="max-w-3xl font-[var(--font-display)] text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Graduate Programs Office
              </h1>
            </div>
          </div>

          <p className="max-w-2xl border-l-2 border-[var(--up-gold)] pl-4 text-sm leading-7 text-[rgba(255,255,255,0.84)] sm:text-base">
            Placeholder hero copy for the office introduction. This area will eventually carry the real message, imagery, and branding.
          </p>
        </div>
      </div>
    </section>
  );
}