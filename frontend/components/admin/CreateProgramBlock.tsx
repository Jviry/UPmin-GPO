'use client';

export function CreateProgramBlock({ onCancel }: { onCancel: () => void }) {
  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Create New Graduate Program
        </h2>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-6">
        <div className="col-span-3 flex flex-col gap-4">
          {/* Department removed. Name input now spans full width of the left block */}
          <input
            type="text"
            className="h-10 w-full border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="Name of Program"
          />
          <textarea
            className="flex-1 min-h-[140px] resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="About Graduate Program..."
          />
        </div>

        <div className="col-span-1 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center transition hover:border-[var(--up-maroon)]">
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Featured Photo</span>
          <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
        <button
          onClick={onCancel}
          className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">
          Save
        </button>
      </div>
    </section>
  );
}