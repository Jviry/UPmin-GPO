const programs = [
  "Program Alpha",
  "Program Beta",
  "Program Gamma",
  "Program Delta",
  "Program Epsilon",
  "Program Zeta",
  "Program Eta",
  "Program Theta",
  "Program Iota",
];

export function HomePrograms() {
  return (
    <section id="programs" className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] px-6 py-0 sm:px-10 lg:px-16">
      <div className="mx-auto flex h-[calc(100dvh-var(--header-height))] max-w-[1400px] flex-col py-6 sm:py-8 lg:py-10">
        <div className="grid flex-1 min-h-0 gap-8 overflow-hidden lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:gap-10">
          <aside className="border-b border-[var(--line)] pb-5 lg:border-b-0 lg:border-r lg:border-[var(--line)] lg:pr-8 lg:pb-0 lg:pt-2">
            <div className="lg:max-w-[280px]">
              <h2 className="[font-family:var(--font-display)] text-[2.75rem] font-semibold leading-[0.95] text-[var(--up-maroon)] sm:text-5xl lg:text-[4rem]">
                Graduate Programs
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--text-secondary)] sm:text-base lg:text-[1.02rem] lg:leading-8">
                Placeholder definition for the graduate programs offered. This text stays pinned on the left while the list scrolls vertically on
                the right.
              </p>
            </div>
          </aside>

          <div className="flex min-h-0 flex-col justify-stretch lg:pl-8">
            <div className="modern-scrollbar h-full min-h-0 overflow-y-auto pr-3 [scrollbar-gutter:stable]">
              <div className="grid gap-4 pb-2 sm:gap-5 md:grid-cols-2 xl:gap-6">
                {programs.map((program) => (
                  <article
                    key={program}
                    className="group relative aspect-[4/3] overflow-hidden bg-[var(--surface-muted)] shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(0,0,0,0.12))]" />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tracking-[0.45em] text-[rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-[1.02]">
                      PLACEHOLDER
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.84))]" />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <p className="max-w-[75%] text-sm font-semibold uppercase tracking-[0.18em] text-white sm:text-[0.95rem]">
                        {program}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}