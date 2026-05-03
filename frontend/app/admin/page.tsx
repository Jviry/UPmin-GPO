export default function AdminDashboard() {
  return (
    <main className="mx-auto max-w-[1200px] p-8 py-10">
      
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-4xl font-semibold text-[var(--up-maroon)]" style={{ fontFamily: 'var(--font-display)' }}>
          Hello, Admin
        </h1>
        <div className="h-[2px] flex-1 bg-[var(--line)]"></div>
      </div>

      {/* Block 1: Edit Office Information */}
      <section className="mb-10 border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Edit Office Information
          </h2>
        </div>

        {/* Top Row Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left: Inputs */}
          <div className="col-span-1 flex flex-col space-y-4">
            <input type="text" className="h-10 w-full border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" placeholder="Email" />
            <input type="text" className="h-10 w-full border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" placeholder="Phone" />
            <input type="text" className="h-10 w-full border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" placeholder="Location" />
          </div>

          {/* Middle: Description Textarea */}
          <div className="col-span-2">
             <textarea className="h-full min-h-[140px] w-full resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm text-[var(--text-secondary)] focus:border-[var(--up-gold)] focus:outline-none" placeholder="About GPO Description..."></textarea>
          </div>

          {/* Right: Featured Photo Upload */}
          <div className="col-span-1 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center transition hover:border-[var(--up-maroon)]">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Featured Photo</span>
            <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
          </div>
        </div>

        {/* Bottom Row: Org Chart Upload */}
        <div className="mb-8 flex h-32 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] text-center transition hover:border-[var(--up-maroon)]">
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Organizational Chart</span>
          <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
          <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Cancel</button>
          <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Save</button>
        </div>
      </section>

      {/* Block 2: Admin Management */}
      <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Admin Management
          </h2>
        </div>

        <div className="mb-8 flex h-[350px] flex-col overflow-hidden border border-[var(--line)] bg-[var(--page-bg)]">
          <div className="h-10 w-full border-b border-[var(--line)] bg-[var(--surface-muted)]"></div>
          <div className="flex flex-1 items-center justify-center text-sm font-medium tracking-widest text-[var(--text-muted)] uppercase">
            Program Coordinator Table
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
          <button className="border border-[var(--up-maroon)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] transition hover:bg-red-50">Delete</button>
          <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Edit</button>
          <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Add</button>
        </div>
      </section>
    </main>
  );
}