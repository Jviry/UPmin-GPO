"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getScholarships } from "../services/apiServices";
import { LoadingBlock } from "@/components/LoadingSpinner";

export function ScholarshipCarousel() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLAnchorElement>(null);
  const lastCardRef = useRef<HTMLAnchorElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchScholarshipsData = async () => {
      try {
        setIsLoading(true);
        const data = await getScholarships();
        setScholarships(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarshipsData();
  }, []);

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
    if (isLoading || error || scholarships.length === 0) return;

    updateScrollState();

    const track = trackRef.current;
    if (!track) return undefined;

    const handleResize = () => updateScrollState();

    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", handleResize);
    };
  }, [scholarships, isLoading, error]);

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
    <section className="relative overflow-hidden bg-[var(--page-bg)] px-6 py-12 sm:px-10 lg:px-16 border-t border-[var(--line)]">
      <div className="mx-auto flex flex-col max-w-[1400px]">
        <div className="mb-8 flex flex-col gap-4">
          <h2 className="[font-family:var(--font-display)] text-3xl font-semibold text-[var(--up-maroon)] sm:text-4xl">Available Scholarships</h2>
          <div className="h-[3px] w-16 bg-[var(--up-gold)]" />
        </div>

        <div className="relative flex w-full items-stretch">
          
          {isLoading && <LoadingBlock />}

          {error && (
            <div className="flex w-full items-center py-10">
              <p className="text-lg text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && !error && scholarships.length === 0 && (
            <div className="flex w-full items-center py-10">
              <p className="text-lg text-[var(--text-secondary)]">No scholarships available at this time.</p>
            </div>
          )}

          {!isLoading && !error && scholarships.length > 0 && (
            <>
              {canScrollLeft && (
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(90deg,var(--page-bg)_0%,transparent_100%)] sm:w-20" />
              )}
              {canScrollRight && (
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(270deg,var(--page-bg)_0%,transparent_100%)] sm:w-20" />
              )}

              {canScrollLeft && (
                <button
                  type="button"
                  aria-label="Previous scholarships"
                  onClick={() => scrollTrack(-1)}
                  className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(118,9,12,0.15)] bg-white text-lg text-[var(--up-maroon)] shadow-md transition-all duration-200 hover:border-[var(--up-gold)] hover:bg-[var(--up-maroon)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--up-gold)] md:flex"
                >
                  <span className="-translate-x-px leading-none transition-transform duration-200 hover:-translate-x-0.5">←</span>
                </button>
              )}

              <div
                ref={trackRef}
                className="flex w-full gap-5 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory xl:gap-6 hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {scholarships.map((scholarship, index) => (
                  <Link
                    href={`/scholarships/${scholarship.scholarship_id}`}
                    key={scholarship.scholarship_id || index} 
                    ref={index === 0 ? firstCardRef as any : index === scholarships.length - 1 ? lastCardRef as any : undefined}
                    className="group relative flex min-h-[380px] w-[272px] shrink-0 snap-start flex-col bg-[var(--surface)] text-left shadow-sm border border-[rgba(118,9,12,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--up-gold)] sm:w-[288px] lg:w-[308px] overflow-hidden rounded-xl"
                  >
                    <div className="absolute inset-x-0 top-0 z-10 h-[3px] bg-[var(--up-gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="h-40 w-full shrink-0 overflow-hidden bg-[var(--surface-muted)] relative">
                      <img
                        src={scholarship.image_url || "/hero-section-background.jpg"}
                        alt={scholarship.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <div className="h-[2px] w-6 bg-[var(--up-maroon)]" />
                          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-[var(--up-maroon)]">Scholarship</p>
                        </div>
                        <h3 className="font-[var(--font-display)] text-[1.25rem] leading-snug text-[var(--up-maroon)] line-clamp-2">{scholarship.name}</h3>
                        <p className="mt-3 text-sm leading-[1.6] text-[var(--text-secondary)] line-clamp-3">{scholarship.description}</p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[var(--up-maroon)]">
                        <span>View details</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {canScrollRight && (
                <button
                  type="button"
                  aria-label="Next scholarships"
                  onClick={() => scrollTrack(1)}
                  className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(118,9,12,0.15)] bg-white text-lg text-[var(--up-maroon)] shadow-md transition-all duration-200 hover:border-[var(--up-gold)] hover:bg-[var(--up-maroon)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--up-gold)] md:flex"
                >
                  <span className="translate-x-px leading-none transition-transform duration-200 hover:translate-x-0.5">→</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
