'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/admin/LoadingScreen';
import FacultyManagement from '@/components/admin/FacultyManagement';

type OfficeInfo = {
  office_id: number;
  email: string;
  phone: string;
  mission: string;
  org_chart_url: string;
};

type Admin = {
  admin_id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperadmin = user?.role === 'superadmin';

  const [office, setOffice] = useState<OfficeInfo | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const requests: Promise<any>[] = [apiClient.get('/office')];
        if (isSuperadmin) requests.push(apiClient.get('/admins'));

        const [officeRes, adminsRes] = await Promise.all(requests);
        setOffice(officeRes.data.office || officeRes.data[0]);
        if (adminsRes) setAdmins(adminsRes.data.admins || adminsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isSuperadmin]);

  if (isLoading) {
    return <LoadingScreen />;
  }

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

        <div className="mb-8 flex h-32 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] text-center transition hover:border-[var(--up-maroon)]">
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Organizational Chart</span>
          {office?.org_chart_url ? (
            <span className="mt-1 text-xs text-green-600">Current file uploaded</span>
          ) : (
            <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
          )}
        </div>

        <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
          <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Cancel</button>
          <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Save</button>
        </div>
      </section>

      {/* Block 2: Admin Management — superadmin only */}
      {isSuperadmin && <section className="mb-10 border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Admin Management
          </h2>
        </div>

        <div className="mb-8 flex h-[350px] flex-col overflow-hidden border border-[var(--line)] bg-white">
          <div className="grid grid-cols-12 gap-4 border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <div className="col-span-4">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-4">Role</div>
          </div>
          
          <div className="modern-scrollbar flex-1 overflow-y-auto">
            {admins.map((admin, index) => (
              <div 
                key={admin.admin_id} 
                className={`grid grid-cols-12 items-center gap-4 border-b border-[var(--line)] px-6 py-4 text-sm transition hover:bg-gray-50 cursor-pointer ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'
                }`}
              >
                <div className="col-span-4 font-semibold text-[var(--text-primary)]">{admin.name}</div>
                <div className="col-span-4 text-[var(--text-secondary)]">{admin.email}</div>
                <div className="col-span-4">
                  <span className={`inline-block rounded px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest ${
                    admin.role === 'Superadmin' 
                      ? 'bg-[var(--up-maroon)] text-white shadow-sm' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {admin.role}
                  </span>
                </div>
              </div>
            ))}
            {admins.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">No admins found.</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
          <button className="border border-[var(--up-maroon)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] transition hover:bg-red-50">Delete</button>
          <button className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Edit</button>
          <button className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">Add Admin</button>
        </div>
      </section>}

      {/* Block 3: Faculty Management */}
      <section className="mb-10 border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Faculty Management
          </h2>
        </div>
        <FacultyManagement />
      </section>
    </main>
  );
}