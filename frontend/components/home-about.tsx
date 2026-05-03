'use client';

import { useState, useEffect } from 'react';
import { getOfficeInfo } from '../services/apiServices';

export function HomeAbout() {
  const [office, setOffice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Carousel State ---
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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

  // --- Carousel Handlers ---
  const photos = office?.featuredPhotos || [];
  const hasPhotos = photos.length > 0;
  const currentPhotoUrl = hasPhotos ? `http://localhost:3001${photos[currentPhotoIndex].url}` : null;

  const handleNextPhoto = () => {
    if (hasPhotos) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const handlePrevPhoto = () => {
    if (hasPhotos) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  return (
    <section id="about" className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface)] px-6 py-0 sm:px-10 lg:px-16">
      <div className="mx-auto flex h-[calc(100dvh-var(--header-height))] max-w-[1400px] flex-col py-6 sm:py-8 lg:py-10">
        
        <h2 className="text-4xl font-semibold text-[var(--up-maroon)] sm:text-5xl lg:text-[4rem]" style={{ fontFamily: 'var(--font-display)' }}>
          About Office
        </h2>

        <div className="mt-6 grid flex-1 min-h-0 gap-8 overflow-hidden lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-10">
          
          <div className="flex min-h-0 items-stretch">
            <div className="group flex h-full w-full items-stretch overflow-hidden bg-[var(--surface-muted)] relative">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm tracking-widest text-[var(--text-muted)] animate-pulse">LOADING...</span>
                </div>
              ) : hasPhotos && currentPhotoUrl ? (
                <>
                  <img 
                    src={currentPhotoUrl} 
                    alt={`Featured Office ${currentPhotoIndex + 1}`} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl text-white backdrop-blur-md transition-all hover:bg-[var(--up-maroon)] focus:outline-none focus:ring-2 focus:ring-[var(--up-gold)]"
                        aria-label="Previous photo"
                      >
                        ←
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl text-white backdrop-blur-md transition-all hover:bg-[var(--up-maroon)] focus:outline-none focus:ring-2 focus:ring-[var(--up-gold)]"
                        aria-label="Next photo"
                      >
                        →
                      </button>

                      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                        {photos.map((_: any, index: number) => (
                          <div 
                            key={index} 
                            className={`h-2.5 w-2.5 rounded-full transition-colors ${index === currentPhotoIndex ? 'bg-[var(--up-gold)]' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
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

          <div className="flex min-h-0 flex-col justify-between overflow-hidden bg-[var(--surface)] p-4 sm:p-5 lg:p-6">
            <div className="modern-scrollbar max-w-none space-y-6 overflow-y-auto pr-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base lg:max-w-[760px] lg:text-[1.02rem] lg:leading-8">
              {isLoading ? (
                <p className="animate-pulse">Loading office details...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : office ? (
                <>
                  {office.history && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--up-maroon)]">History</h3>
                      <p>{office.history}</p>
                    </div>
                  )}
                  {office.vision && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--up-maroon)]">Vision</h3>
                      <p>{office.vision}</p>
                    </div>
                  )}
                  {office.mission && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--up-maroon)]">Mission</h3>
                      <p>{office.mission}</p>
                    </div>
                  )}
                  {office.core_values && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--up-maroon)]">Core Values</h3>
                      <p className="whitespace-pre-wrap">{office.core_values}</p>
                    </div>
                  )}
                </>
              ) : (
                <p>No office details available at this time.</p>
              )}
            </div>

            <div className="mt-8 flex shrink-0 justify-end pt-4">
              <button
                type="button"
                className="inline-flex items-center justify-center border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-200 hover:bg-[#5c0709]"
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