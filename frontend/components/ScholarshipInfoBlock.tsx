import React from 'react';

interface ScholarshipInfoBlockProps {
  title: string;
  content: string;
}

export function ScholarshipInfoBlock({ title, content }: ScholarshipInfoBlockProps) {
  if (!content) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-[var(--up-maroon)] mb-3 border-b border-[var(--line)] pb-2">{title}</h2>
      <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{content}</p>
    </div>
  );
}
