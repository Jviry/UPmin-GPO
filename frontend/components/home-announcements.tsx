"use client";

import { useEffect, useRef, useState } from "react";

const announcements = [
  {
    title: "Announcement Title One",
    excerpt: "Placeholder announcement text describing the first few sentences of the update. More details will replace this later.",
  },
  {
    title: "Announcement Title Two",
    excerpt: "Placeholder announcement text for another item in the carousel strip. This is intentionally concise for layout testing.",
  },
  {
    title: "Announcement Title Three",
    excerpt: "Placeholder announcement text for a third card. The goal here is to validate spacing, flow, and card balance.",
  },
  {
    title: "Announcement Title Four",
    excerpt: "Placeholder announcement text for a fourth item. This supports testing the grid density and spacing across the section.",
  },
  {
    title: "Announcement Title Five",
    excerpt: "Placeholder announcement text for a fifth item. This keeps the section populated for layout and interaction checks.",
  },
  {
    title: "Announcement Title Six",
    excerpt: "Placeholder announcement text for a sixth item. This helps test the section density and visual balance.",
  },
  {
    title: "Announcement Title Seven",
    excerpt: "Placeholder announcement text for a seventh item. This is included to verify the layout with a larger set of cards.",
  },
];

export function HomeAnnouncements() {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLButtonElement>(null);
  const lastCardRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const track = trackRef.current;
    const firstCard = firstCardRef.current;
    const lastCard = lastCardRef.current;

    if (!track || !firstCard || !lastCard) {
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const firstCardRect = firstCard.getBoundingClientRect();
    const lastCardRect = lastCard.getBoundingClientRect();

    setCanScrollLeft(firstCardRect.right < trackRect.left + 8);
    setCanScrollRight(lastCardRect.right > trackRect.right - 8);
  };

  useEffect(() => {
    updateScrollState();

    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    const handleResize = () => updateScrollState();

    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollTrack = (direction: -1 | 1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.scrollBy({
      left: direction * 360,
      behavior: "smooth",
    });

    window.setTimeout(updateScrollState, 180);
  };

  return (
    <section id="announcements" className="relative overflow-hidden border-t border-[rgba(255,255,255,0.08)] bg-[var(--announcement-bg)] px-4 py-0 sm:px-6 lg:px-10">
      <div className="mx-auto flex h-[calc(100dvh-var(--header-height))] max-w-[1400px] flex-col py-6 sm:py-8 lg:py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[var(--font-display)] text-4xl text-white sm:text-5xl lg:text-[4rem]">Announcements</h2>
            <div className="mt-3 h-[3px] w-16 bg-[var(--up-gold)]" />
          </div>
          <p className="hidden text-[0.65rem] uppercase tracking-[0.35em] text-[rgba(255,255,255,0.45)] md:block">Latest updates</p>
        </div>

        <div className="relative flex flex-1 min-h-0 items-stretch">
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-[linear-gradient(90deg,var(--announcement-bg)_0%,rgba(1,45,23,0)_100%)] sm:w-24 lg:w-28" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-[linear-gradient(270deg,var(--announcement-bg)_0%,rgba(1,45,23,0)_100%)] sm:w-24 lg:w-28" />
          )}

          {canScrollLeft && (
            <button
              type="button"
              aria-label="Previous announcements"
              onClick={() => scrollTrack(-1)}
              className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(1,68,33,0.85)] text-lg text-[var(--up-gold)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 hover:border-[var(--up-gold)] hover:bg-[rgba(1,68,33,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(243,170,44,0.6)]"
            >
              <span className="-translate-x-px leading-none transition-transform duration-200 hover:-translate-x-0.5">←</span>
            </button>
          )}

          <div
            ref={trackRef}
            className="modern-carousel flex h-full min-h-0 flex-1 gap-5 overflow-x-auto overflow-y-hidden px-4 pb-2 snap-x snap-mandatory sm:px-6 lg:px-8 xl:gap-6"
          >
            {announcements.map((announcement, index) => (
              <button
                key={announcement.title}
                ref={index === 0 ? firstCardRef : index === announcements.length - 1 ? lastCardRef : undefined}
                type="button"
                className="group relative flex h-full min-h-[380px] w-[272px] shrink-0 snap-start flex-col justify-between bg-[#faf6f0] p-6 text-left shadow-[0_8px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--up-gold)] sm:w-[288px] lg:w-[308px]"
              >
                {/* Gold top accent strip */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--up-gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-[2px] w-6 bg-[var(--up-maroon)]" />
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-[var(--up-maroon)]">Announcement</p>
                  </div>
                  <h3 className="font-[var(--font-display)] text-[1.35rem] leading-snug text-[var(--up-maroon)]">{announcement.title}</h3>
                  <p className="mt-3 text-sm leading-[1.75] text-[#5a5450]">{announcement.excerpt}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[rgba(118,9,12,0.12)] pt-4 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[var(--up-maroon)]">
                  <span>Read more</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </button>
            ))}
          </div>

          {canScrollRight && (
            <button
              type="button"
              aria-label="Next announcements"
              onClick={() => scrollTrack(1)}
              className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(1,68,33,0.85)] text-lg text-[var(--up-gold)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 hover:border-[var(--up-gold)] hover:bg-[rgba(1,68,33,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(243,170,44,0.6)]"
            >
              <span className="translate-x-px leading-none transition-transform duration-200 hover:translate-x-0.5">→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}