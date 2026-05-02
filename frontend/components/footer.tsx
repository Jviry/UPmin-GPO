'use client';

import { useState, useEffect } from 'react';
import { getOfficeInfo } from '../services/apiServices';

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
      <div className="mx-auto grid max-w-[1400px] gap-8 text-sm text-[var(--text-secondary)] md:grid-cols-3">
        
        {/* Column 1: Summary */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {office?.name || 'Graduate Programs Office'}
          </p>
          <p className="mt-3 max-w-sm">
            {isLoading 
              ? 'Loading summary...' 
              : office?.objectives || 'Excellence in graduate education.'}
          </p>
        </div>
        
        {/* Column 2: Quick Links (Keeping static for now) */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Quick Links</p>
          <div className="mt-3 space-y-2">
            <p className="cursor-pointer hover:text-[var(--up-maroon)]">Admissions</p>
            <p className="cursor-pointer hover:text-[var(--up-maroon)]">Curriculum Guide</p>
            <p className="cursor-pointer hover:text-[var(--up-maroon)]">Forms</p>
          </div>
        </div>
        
        {/* Column 3: Contact */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Contact</p>
          <div className="mt-3 space-y-2">
            {isLoading ? (
              <p>Loading contact info...</p>
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