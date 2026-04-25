// This is a placeholder image for profile blocks. Replace with real images as needed.

export default function PlaceholderProfileImg({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-[var(--surface-muted)] border-2 border-[var(--up-gold)] rounded ${className}`}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="w-2/3 h-2/3 opacity-40">
        <circle cx="24" cy="18" r="8" fill="#bdbdbd" />
        <rect x="8" y="32" width="32" height="8" rx="4" fill="#bdbdbd" />
      </svg>
    </div>
  );
}
