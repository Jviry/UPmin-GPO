export default function LoadingScreen() {
  return (
    <div className="flex h-full min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-4 bg-[var(--page-bg)]">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--line)]" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[var(--up-maroon)]" />
      </div>
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">
        Loading
      </span>
    </div>
  );
}
