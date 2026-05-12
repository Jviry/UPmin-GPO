'use client';

import { AnnouncementManagementBlock } from '@/components/admin/AnnouncementManagementBlock';

export default function AdminAnnouncementsPage() {
  return (
    <main className="mx-auto max-w-[1200px] p-8 py-10">
      {/* Page Title Header (Matches Admin Dashboard) */}
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-4xl font-semibold text-[var(--up-maroon)]" style={{ fontFamily: 'var(--font-display)' }}>
          Announcements
        </h1>
        <div className="h-[2px] flex-1 bg-[var(--line)]"></div>
      </div>

      {/* The Management Component */}
      <AnnouncementManagementBlock />
    </main>
  );
}