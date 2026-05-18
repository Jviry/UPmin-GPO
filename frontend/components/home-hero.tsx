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

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="w-full max-w-4xl">
          <div className="mb-6 flex flex-col items-center gap-5 text-center md:mb-8 md:flex-row md:items-center md:gap-8 md:text-left">
            <Image
              src="/Unibersidad_ng_Pilipinas_Mindanao.png"
              alt="University of the Philippines Mindanao"
              width={144}
              height={144}
              className="object-contain"
              style={{ width: 'clamp(72px, 18vw, 144px)', height: 'auto', flexShrink: 0 }}
            />
            <div>
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.4em] text-[rgba(255,255,255,0.72)] sm:text-xs">Placeholder Office Tagline</p>
              <h1 className="font-[var(--font-display)] text-[2rem] leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Graduate Programs Office
              </h1>
            </div>
          </div>

          <p className="mx-auto max-w-2xl border-l-2 border-[var(--up-gold)] pl-4 text-sm leading-7 text-[rgba(255,255,255,0.84)] sm:text-base md:mx-0">
            Placeholder hero copy for the office introduction. This area will eventually carry the real message, imagery, and branding.
          </p>
        </div>
      </div>
    </section>
  );
}