import React from 'react';

interface ScholarshipActionButtonsProps {
  applicationUrl?: string | null;
  recommendationUrl?: string | null;
}

export function ScholarshipActionButtons({ applicationUrl, recommendationUrl }: ScholarshipActionButtonsProps) {
  if (!applicationUrl && !recommendationUrl) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-4 clear-both">
      {applicationUrl && (
        <a 
          href={applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-[var(--up-maroon)] px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--up-maroon-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--up-gold)] focus-visible:ring-offset-2"
        >
          Apply Now
        </a>
      )}
      {recommendationUrl && (
        <a 
          href={recommendationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-[var(--up-maroon)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--up-maroon)] shadow-sm transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--up-maroon)] focus-visible:ring-offset-2"
        >
          Recommendation Form
        </a>
      )}
    </div>
  );
}
