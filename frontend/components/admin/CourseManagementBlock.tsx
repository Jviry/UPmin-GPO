'use client';

import { StudyPlanBuilder } from '@/components/admin/StudyPlanBuilder';

export function CourseManagementBlock({ programId }: { programId: number }) {
  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Course Management
        </h2>
      </div>
      <StudyPlanBuilder programId={programId} />
    </section>
  );
}
