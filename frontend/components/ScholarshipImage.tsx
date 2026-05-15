import React from 'react';

interface ScholarshipImageProps {
  imageUrl?: string | null;
  name: string;
}

export function ScholarshipImage({ imageUrl, name }: ScholarshipImageProps) {
  return (
    <div className="mb-6 w-full md:w-5/12 md:float-left md:mr-8 md:mb-6 overflow-hidden rounded-xl border border-[rgba(118,9,12,0.1)] shadow-sm bg-[var(--up-maroon)]">
      <img
        src={imageUrl || "/hero-section-background.jpg"}
        alt={name}
        className="w-full h-auto object-cover aspect-[4/3] md:aspect-[4/5]"
      />
    </div>
  );
}
