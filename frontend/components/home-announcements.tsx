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
    <section id="announcements" className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--announcement-bg)] px-4 py-0 sm:px-6 lg:px-10">
      <div className="mx-auto flex h-[calc(100dvh-var(--header-height))] max-w-[1400px] flex-col py-6 sm:py-8 lg:py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h2 className="font-[var(--font-display)] text-4xl text-[var(--text-primary)] sm:text-5xl lg:text-[4rem]">Announcements</h2>
          <p className="hidden text-xs uppercase tracking-[0.3em] text-[var(--text-muted)] md:block">Placeholder announcement cards</p>
        </div>

        <div className="relative flex flex-1 min-h-0 items-stretch">
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-[linear-gradient(90deg,var(--announcement-bg)_0%,rgba(217,217,217,0)_100%)] sm:w-24 lg:w-28" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-[linear-gradient(270deg,var(--announcement-bg)_0%,rgba(217,217,217,0)_100%)] sm:w-24 lg:w-28" />
          )}

          {canScrollLeft && (
            <button
              type="button"
              aria-label="Previous announcements"
              onClick={() => scrollTrack(-1)}
              className="absolute left-2 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.42)] bg-[rgba(255,255,255,0.32)] text-xl text-[var(--text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-xl transition-all duration-200 hover:bg-[rgba(255,255,255,0.5)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(23,23,23,0.28)]"
            >
              <span className="-translate-x-px text-[1.1rem] leading-none transition-transform duration-200 hover:-translate-x-0.5">
                ←
              </span>
            </button>
          )}

          <div
            ref={trackRef}
            className="modern-carousel flex h-full min-h-0 flex-1 gap-4 overflow-x-auto overflow-y-hidden px-12 pb-2 snap-x snap-mandatory sm:px-16 lg:px-20 xl:gap-5"
          >
            {announcements.map((announcement, index) => (
              <button
                key={announcement.title}
                ref={index === 0 ? firstCardRef : index === announcements.length - 1 ? lastCardRef : undefined}
                type="button"
                className="group flex h-full min-h-[360px] w-[280px] shrink-0 snap-start flex-col justify-between border border-transparent bg-[rgba(93,93,93,0.92)] p-6 text-left text-white shadow-[0_18px_42px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(23,23,23,0.35)] sm:w-[300px] lg:w-[320px]"
              >
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[rgba(255,255,255,0.62)]">Headline</p>
                  <h3 className="mt-4 font-[var(--font-display)] text-2xl leading-tight">{announcement.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[rgba(255,255,255,0.82)]">{announcement.excerpt}</p>
                </div>

                <div className="mt-8 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[rgba(255,255,255,0.78)]">
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
              className="absolute right-2 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.42)] bg-[rgba(255,255,255,0.32)] text-xl text-[var(--text-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-xl transition-all duration-200 hover:bg-[rgba(255,255,255,0.5)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(23,23,23,0.28)]"
            >
              <span className="translate-x-px text-[1.1rem] leading-none transition-transform duration-200 hover:translate-x-0.5">
                →
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}