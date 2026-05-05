import { StudyPlanBuilder } from '@/components/admin/StudyPlanBuilder';

const MOCK_FACULTY = [
  { id: 1, name: "Dr. Maria Stella Salazar", position: "Professor", email: "mssalazar@up.edu.ph" },
  { id: 2, name: "Prof. Juma Novie A. Alviola", position: "Associate Professor", email: "jnalviola@up.edu.ph" },
  { id: 3, name: "Dr. Jose Rizal", position: "Guest Lecturer", email: "jrizal@up.edu.ph" },
];

const MOCK_FILES = [
  { id: 1, name: "MS_CS_Application_Form_2026.pdf", type: "PDF", date: "May 1, 2026", size: "1.2 MB" },
  { id: 2, name: "Tuition_Fee_Assessment_Grid.xlsx", type: "Spreadsheet", date: "Apr 28, 2026", size: "450 KB" },
  { id: 3, name: "Recommendation_Letter_Template.docx", type: "Document", date: "Feb 15, 2026", size: "120 KB" },
];

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

          <div className="mb-8 flex h-[350px] flex-col overflow-hidden border border-[var(--line)] bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              <div className="col-span-4">Name</div>
              <div className="col-span-4">Position</div>
              <div className="col-span-4">Email</div>
            </div>
            
            {/* Table Body (Scrollable) */}
            <div className="modern-scrollbar flex-1 overflow-y-auto">
              {MOCK_FACULTY.map((faculty, index) => (
                <div 
                  key={faculty.id} 
                  className={`grid grid-cols-12 gap-4 border-b border-[var(--line)] px-6 py-4 text-sm transition hover:bg-gray-50 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'
                  }`}
                >
                  <div className="col-span-4 font-semibold text-[var(--text-primary)]">{faculty.name}</div>
                  <div className="col-span-4 text-[var(--text-secondary)]">{faculty.position}</div>
                  <div className="col-span-4 text-[var(--text-secondary)]">{faculty.email}</div>
                </div>
              ))}
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

          <div className="mb-8 flex h-[250px] flex-col overflow-hidden border border-[var(--line)] bg-white">
            <div className="modern-scrollbar flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--page-bg)]">
              {MOCK_FILES.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between rounded border border-[var(--line)] bg-white p-4 shadow-sm transition hover:border-[var(--up-gold)] cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Fake Document Icon Box */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[var(--surface-muted)] font-bold text-[var(--up-maroon)] text-xs">
                      {file.type === "PDF" ? "PDF" : "DOC"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[var(--text-primary)]">{file.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Uploaded {file.date} • {file.size}
                      </p>
                    </div>
                  </div>
                  
                  {/* Select Checkbox (Visual Only) */}
                  <div className="h-4 w-4 rounded-sm border border-[var(--text-muted)]"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
            <button className="border border-[var(--up-maroon)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] transition hover:bg-red-50">Delete</button>
            <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Edit</button>
            <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Upload File</button>
          </div>
        </section>
        
      </main>
    </div>
  );
}