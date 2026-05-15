'use client';

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmClassName,
  onConfirm,
  onCancel,
  isLoading = false,
  children,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm border border-[var(--line)] bg-white p-8 shadow-lg">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mb-4 text-sm text-[var(--text-secondary)]">{message}</p>
        {children}
        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="border border-[var(--text-muted)] px-6 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={confirmClassName ?? 'border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-6 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709] disabled:opacity-50'}
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
