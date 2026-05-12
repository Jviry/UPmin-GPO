'use client';

export function FormsFeesManagementBlock({ program }: { program: any }) {
  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Forms & Fees File Management
        </h2>
      </div>

      <div className="mb-8 flex h-[250px] flex-col overflow-hidden border border-[var(--line)] bg-white">
        <div className="modern-scrollbar flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--page-bg)]">
          {program?.forms && program.forms.length > 0 ? (
            program.forms.map((file: any) => (
              <div
                key={file.form_id}
                className="flex items-center justify-between rounded border border-[var(--line)] bg-white p-4 shadow-sm transition hover:border-[var(--up-gold)] cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Document Icon Box */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[var(--surface-muted)] font-bold text-[var(--up-maroon)] text-xs">
                    {file.type === "PDF" ? "PDF" : "DOC"}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-primary)]">{file.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Uploaded {new Date(file.upload_date).toLocaleDateString()} • {file.size}
                    </p>
                  </div>
                </div>

                {/* Select Checkbox (Visual Only) */}
                <div className="h-4 w-4 rounded-sm border border-[var(--text-muted)]"></div>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
              No forms or files uploaded for this program yet.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
        <button className="border border-[var(--up-maroon)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] transition hover:bg-red-50">Delete</button>
        <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Edit</button>
        <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Upload File</button>
      </div>
    </section>
  );
}