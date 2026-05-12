'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/admin/LoadingScreen';
import FacultyManagement from '@/components/admin/FacultyManagement';
import AdminManagement from '@/components/admin/AdminManagement';
import { updateGoogleFormUrl } from '@/services/apiServices';

type OfficeInfo = {
  office_id: number;
  email: string;
  phone: string;
  mission: string;
  org_chart_url: string;
  application_google_url?: string;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperadmin = user?.role === 'superadmin';

  const [office, setOffice] = useState<OfficeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleUrl, setGoogleUrl] = useState('');
  const [officeSaving, setOfficeSaving] = useState(false);
  const [officeError, setOfficeError] = useState<string | null>(null);
  const [officeSuccess, setOfficeSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const officeRes = await apiClient.get('/office');
        const officeData = officeRes.data.office || officeRes.data[0];
        setOffice(officeData);
        setGoogleUrl(officeData?.application_google_url ?? '');
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleOfficeSave = async () => {
    try {
      setOfficeSaving(true);
      setOfficeError(null);
      setOfficeSuccess(null);
      const trimmed = googleUrl.trim();
      await updateGoogleFormUrl(trimmed);
      setOffice(prev => prev ? { ...prev, application_google_url: trimmed } : prev);
      setOfficeSuccess('Office information saved');
    } catch (err: any) {
      setOfficeError(err.message || 'Failed to save');
    } finally {
      setOfficeSaving(false);
    }
  };

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

        {officeError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">{officeError}</div>
        )}
        {officeSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-sm">{officeSuccess}</div>
        )}

        <div className="mb-6 flex h-32 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] text-center transition hover:border-[var(--up-maroon)]">
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Organizational Chart</span>
          {office?.org_chart_url ? (
            <span className="mt-1 text-xs text-green-600">Current file uploaded</span>
          ) : (
            <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
            Application Google Form URL
          </label>
          <input
            type="url"
            value={googleUrl}
            onChange={(e) => { setGoogleUrl(e.target.value); setOfficeError(null); setOfficeSuccess(null); }}
            placeholder={office?.application_google_url || 'https://docs.google.com/forms/d/...'}
            className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
          />
        </div>

        <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
          <button
            onClick={() => { setGoogleUrl(office?.application_google_url ?? ''); setOfficeError(null); setOfficeSuccess(null); }}
            className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleOfficeSave}
            disabled={officeSaving}
            className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709] disabled:opacity-60"
          >
            {officeSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </section>

      {/* Block 2: Admin Management — superadmin only */}
      {isSuperadmin && (
        <section className="mb-10 border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Admin Management
            </h2>
          </div>
          <AdminManagement />
        </section>
      )}

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