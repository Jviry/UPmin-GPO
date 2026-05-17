type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerVariant = 'maroon' | 'white' | 'gold';

const sizes: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

const variants: Record<SpinnerVariant, string> = {
  maroon: 'border-[var(--up-maroon)] border-t-transparent',
  white:  'border-white border-t-transparent',
  gold:   'border-[var(--up-gold)] border-t-transparent',
};

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

export function LoadingSpinner({ size = 'md', variant = 'maroon', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full ${sizes[size]} ${variants[variant]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Full-viewport centred spinner — use for page-level loading states. */
export function LoadingScreen({ variant = 'maroon' }: { variant?: SpinnerVariant }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" variant={variant} />
    </div>
  );
}

/** Section-centred spinner — use inside a section/container. */
export function LoadingBlock({
  variant = 'maroon',
  className = 'py-10',
}: {
  variant?: SpinnerVariant;
  className?: string;
}) {
  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <LoadingSpinner size="md" variant={variant} />
    </div>
  );
}
