export function HomeAbout() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] px-4 py-0 sm:px-6 lg:px-10">
      <div className="mx-auto flex h-[calc(100dvh-var(--header-height))] max-w-[1400px] flex-col py-6 sm:py-8 lg:py-10">
        <h2 className="font-[var(--font-display)] text-4xl text-[var(--text-primary)] sm:text-5xl lg:text-[4rem]">
          About Office
        </h2>

        <div className="mt-6 grid flex-1 min-h-0 gap-8 overflow-hidden lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-10">
          <div className="flex min-h-0 items-stretch">
            <div className="flex h-full w-full items-stretch overflow-hidden bg-[var(--surface-muted)]">
              <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)]">
                <div className="text-center text-xs font-semibold tracking-[0.4em] text-[var(--text-muted)] sm:text-sm">
                  FEATURED
                  <br />
                  PHOTO
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col justify-between overflow-hidden bg-[var(--surface)] p-4 sm:p-5 lg:p-6">
            <div className="max-w-none space-y-5 text-sm leading-7 text-[var(--text-secondary)] sm:text-base lg:max-w-[760px] lg:text-[1.02rem] lg:leading-8">
              <p>
                Placeholder office history copy. This section will eventually explain the office background, role, and the story behind its
                graduate programs.
              </p>
              <p>
                Placeholder office history copy continues here so the layout can be tested with paragraph rhythm, spacing, and text density.
              </p>
              <p>
                Placeholder office history copy ends here with enough lines to mimic the wireframe and support later content replacement.
              </p>
              <p>
                Placeholder office history copy continues here to resemble the longer body text shown in the design reference.
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center border border-[var(--text-primary)] bg-[var(--text-primary)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}