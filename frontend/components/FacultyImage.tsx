'use client';

import { useState } from 'react';
import PlaceholderProfileImg from './PlaceholderProfileImg';

export default function FacultyImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return <PlaceholderProfileImg className="border-0 rounded-none" />;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
}
