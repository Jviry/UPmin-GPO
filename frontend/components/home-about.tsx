'use client';

import { useState, useEffect } from 'react';
import { getOfficeInfo } from '../services/apiServices'; // Adjust path if needed

export function HomeAbout() {
  const [office, setOffice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        setIsLoading(true);
        const data = await getOfficeInfo();
        setOffice(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load office information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfficeData();
  }, []);

  // Use the backend URL to serve the static photo correctly
  const featuredPhotoUrl = office?.featuredPhotos?.[0]?.url 
    ? `http://localhost:3001${office.featuredPhotos[0].url}` 
    : null;

  return (
    <section id="about" className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] px-6 py-0 sm:px-10 lg:px-16">
      <div className="mx-auto flex h-[calc(100dvh-var(--header-height))] max-w-[1400px] flex-col py-6 sm:py-8 lg:py-10">
        <h2 className="text-4xl font-semibold text-[var(--up-maroon)] sm:text-5xl lg:text-[4rem]" style={{ fontFamily: 'var(--font-display)' }}>
          {/* Dynamic title if needed, or keep "About Office" */}
          About {office?.name || 'Office'}
        </h2>

        <div className="mt-6 grid flex-1 min-h-0 gap-8 overflow-hidden lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-10">
          
          {/* Left Column: Photo */}
          <div className="flex min-h-0 items-stretch">
            <div className="flex h-full w-full items-stretch overflow-hidden bg-[var(--surface-muted)] relative">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm tracking-widest text-[var(--text-muted)] animate-pulse">LOADING...</span>
                </div>
              ) : featuredPhotoUrl ? (
                <img 
                  src={featuredPhotoUrl} 
                  alt="Featured Office" 
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)]">
                  <div className="text-center text-xs font-semibold tracking-[0.4em] text-[var(--text-muted)] sm:text-sm">
                    FEATURED
                    <br />
                    PHOTO
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: History Text */}
          <div className="flex min-h-0 flex-col justify-between overflow-hidden bg-[var(--surface)] p-4 sm:p-5 lg:p-6">
            <div className="max-w-none space-y-5 text-sm leading-7 text-[var(--text-secondary)] sm:text-base lg:max-w-[760px] lg:text-[1.02rem] lg:leading-8">
              {isLoading ? (
                <p className="animate-pulse">Loading office history...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : office?.history ? (
                <p>{office.history}</p>
              ) : (
                <p>No office history available at this time.</p>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-200 hover:bg-[#5c0709] hover:border-[#5c0709]"
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