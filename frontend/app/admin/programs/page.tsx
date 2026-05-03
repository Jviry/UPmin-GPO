import { StudyPlanBuilder } from '@/components/admin/StudyPlanBuilder';

export default function AdminPrograms() {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      
      {/* Left Sidebar: Program List */}
      <aside className="w-64 shrink-0 border-r border-[var(--line)] bg-[var(--surface-muted)] py-8">
        <h3 className="px-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)]">
          Programs
        </h3>
        {/* Placeholder for list items */}
        <div className="mt-4 flex flex-col">
          <button className="border-l-4 border-[var(--up-gold)] bg-white px-6 py-3 text-left text-sm font-semibold shadow-sm text-[var(--text-primary)]">
            MS Computer Science
          </button>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 space-y-8 p-8 max-w-[1000px]">
        
        {/* Block 1: Edit Program Information */}
        <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Edit Program Information
            </h2>
          </div>

          <div className="mb-6 grid grid-cols-4 gap-6">
            <div className="col-span-3 flex flex-col gap-4">
              <div className="flex gap-4">
                <input type="text" className="h-10 flex-1 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" placeholder="Name of Program" />
                <input type="text" className="h-10 flex-1 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" placeholder="Department" />
              </div>
              <textarea className="flex-1 min-h-[140px] resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none" placeholder="About Graduate Program..."></textarea>
            </div>

            <div className="col-span-1 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center transition hover:border-[var(--up-maroon)]">
               <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Featured Photo</span>
               <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
            </div>
          </div>

          <div className="mb-4 flex min-h-[200px] items-center justify-center border border-[var(--line)] bg-[var(--page-bg)] text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase">
            Course Management Builder
          </div>

          <div className="mb-8">
            <StudyPlanBuilder />
          </div>

          <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
            <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Cancel</button>
            <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Save</button>
          </div>
        </section>

        {/* Block 2: Faculty Management */}
        <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Faculty Management
            </h2>
          </div>

          <div className="mb-8 flex h-[350px] flex-col overflow-hidden border border-[var(--line)] bg-[var(--page-bg)]">
            <div className="h-10 w-full border-b border-[var(--line)] bg-[var(--surface-muted)]"></div>
            <div className="flex flex-1 items-center justify-center text-sm font-medium tracking-widest text-[var(--text-muted)] uppercase">
              Faculty Table
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
            <button className="border border-[var(--up-maroon)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] transition hover:bg-red-50">Delete</button>
            <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Edit</button>
            <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Add</button>
          </div>
        </section>

        {/* Block 3: Forms & Fees File Management */}
        <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Forms & Fees File Management
            </h2>
          </div>

          <div className="mb-8 flex h-[200px] items-center justify-center border border-[var(--line)] bg-[var(--page-bg)] text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase">
            List of Files (For Forms & Fees Tab)
          </div>

          <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
            <button className="border border-[var(--up-maroon)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] transition hover:bg-red-50">Delete</button>
            <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Edit</button>
            <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Add</button>
          </div>
        </section>
        
      </main>
    </div>
  );
}