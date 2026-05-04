'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAnnouncementById } from '../../../services/apiServices'; // Adjust path as needed

export default function SingleAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [announcement, setAnnouncement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAnnouncement = async () => {
      try {
        setIsLoading(true);
        const data = await getAnnouncementById(id);
        setAnnouncement(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load announcement details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  return (
    <main className="min-h-screen bg-[var(--page-bg)] py-12 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl bg-[var(--surface)] p-8 shadow-sm border border-[var(--line)]">
        
        <button 
          onClick={() => router.back()}
          className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--up-maroon)] hover:underline"
        >
          ← Back
        </button>

        {isLoading && (
          <div className="py-20 text-center text-[var(--text-secondary)] animate-pulse">
            Loading announcement...
          </div>
        )}

        {error && (
          <div className="py-20 text-center text-red-500">
            {error}
          </div>
        )}

        {!isLoading && !error && announcement && (
          <article>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-[2px] w-8 bg-[var(--up-gold)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--text-muted)]">
                {new Date(announcement.date_posted || Date.now()).toLocaleDateString()}
              </p>
            </div>
            
            <h1 className="mb-6 text-3xl font-semibold leading-tight text-[var(--up-maroon)] sm:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
              {announcement.title}
            </h1>
            
            <div className="text-base leading-relaxed text-[var(--text-secondary)]">
              {/* Assuming the full text is in content_description based on your Prisma schema */}
              {announcement.content_description}
            </div>
          </article>
        )}
      </div>
    </main>
  );
}