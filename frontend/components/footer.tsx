'use client';

import { useState, useEffect } from 'react';
import { getOfficeInfo } from '../services/apiServices';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function Footer() {
  const [office, setOffice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        const data = await getOfficeInfo();
        setOffice(data);
      } catch (err) {
        console.error("Failed to load footer data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfficeData();
  }, []);

  return (
    <footer id="forms" className="border-t border-[var(--line)] bg-[var(--page-bg)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-6 text-[0.7rem] text-[var(--text-secondary)] grid-cols-2 md:grid-cols-3 md:gap-8 md:text-sm">

        {/* Column 1: Summary — full width on mobile, 1 col on desktop */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--text-muted)] md:text-xs">
            {office?.name || 'Graduate Programs Office'}
          </p>
          <div className="mt-2 max-w-sm md:mt-3">
            {isLoading
              ? <LoadingSpinner size="sm" variant="maroon" />
              : <p>{office?.objectives || 'Excellence in graduate education.'}</p>}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--text-muted)] md:text-xs">Quick Links</p>
          <div className="mt-2 space-y-1.5 md:mt-3 md:space-y-2">
            <p className="cursor-pointer hover:text-[var(--up-maroon)]">Admissions</p>
            <p className="cursor-pointer hover:text-[var(--up-maroon)]">Curriculum Guide</p>
            <p className="cursor-pointer hover:text-[var(--up-maroon)]">Forms</p>
          </div>
        </div>

        {/* Column 3: Contact */}
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--text-muted)] md:text-xs">Contact</p>
          <div className="mt-2 space-y-1.5 md:mt-3 md:space-y-2">
            {isLoading ? (
              <LoadingSpinner size="sm" variant="maroon" />
            ) : (
              <>
                <p>{office?.location || 'University Campus'}</p>
                <p>{office?.email || 'contact@university.edu'}</p>
                <p>{office?.contact_info || '+63 000 000 0000'}</p>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}