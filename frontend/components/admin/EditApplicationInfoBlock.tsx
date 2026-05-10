'use client';

export function EditApplicationInfoBlock({ program }: { program: any }) {
  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Edit Application Information
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Qualifications</label>
          <textarea
            defaultValue={program.program_application?.qualifications ?? ''}
            className="min-h-[140px] w-full resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="Enter qualifications..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Instructions</label>
          <textarea
            defaultValue={program.program_application?.application_instructions ?? ''}
            className="min-h-[140px] w-full resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="Enter application instructions..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Requirements</label>
          <textarea
            className="min-h-[140px] w-full resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="Enter requirements..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Application URL</label>
          <input
            type="text"
            defaultValue={program.program_application?.application_url ?? ''}
            className="h-10 w-full border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="https://..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Recommendation URL</label>
          <input
            type="text"
            defaultValue={program.program_application?.recommendation_url ?? ''}
            className="h-10 w-full border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-[var(--line)] mt-6 pt-6">
        <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">
          Save
        </button>
      </div>
    </section>
  );
}