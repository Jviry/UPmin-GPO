'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/admin/LoadingScreen';
import { updateOwnProfile, changeOwnPassword } from '@/services/apiServices';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Programs', href: '/admin/programs' },
  { label: 'Scholarships', href: '/admin/scholarships' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isSuperadmin = user?.role === 'superadmin';

  type ProfileModal = 'info' | 'password' | null;
  const [profileModal, setProfileModal] = useState<ProfileModal>(null);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [infoForm, setInfoForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const openModal = (mode: ProfileModal) => {
    setInfoForm({ name: '', email: '' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setModalError('');
    setModalSuccess('');
    setProfileOpen(false);
    setProfileModal(mode);
  };

  const closeModal = () => {
    setProfileModal(null);
    setModalError('');
    setModalSuccess('');
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoForm.name.trim() && !infoForm.email.trim()) {
      setModalError('At least one field is required');
      return;
    }
    try {
      setSubmitting(true);
      setModalError('');
      await updateOwnProfile({
        name: infoForm.name.trim() || undefined,
        email: infoForm.email.trim() || undefined,
      });
      setModalSuccess('Profile updated successfully');
    } catch (err: any) {
      setModalError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setModalError('All fields are required');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setModalError('New passwords do not match');
      return;
    }
    try {
      setSubmitting(true);
      setModalError('');
      await changeOwnPassword(passwordForm.currentPassword, passwordForm.newPassword);
      setModalSuccess('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setModalError(err.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-sans">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(255,255,255,0.95)] backdrop-blur shadow-sm">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-6 py-3 lg:px-10">

          {/* Logo — same as public site */}
          <Link href="/admin" className="flex items-center gap-3 text-[var(--text-primary)]">
            <Image
              src="/Unibersidad_ng_Pilipinas_Mindanao.png"
              alt="University of the Philippines Mindanao"
              width={44}
              height={44}
              className="rounded-full"
              style={{ width: 44, height: 'auto' }}
            />
            <div className="leading-tight">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--text-muted)]">
                University of the Philippines — Mindanao
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Graduate Programs Office</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.22em] text-[var(--text-muted)] md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 hover:text-[var(--up-maroon)] ${
                  pathname === item.href ? 'text-[var(--up-maroon)] font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Profile avatar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--up-maroon)] text-white transition hover:bg-[#5c0709]"
              title="Account"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 border border-[var(--line)] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                <div className="border-b border-[var(--line)] px-4 py-3">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {isSuperadmin ? 'Superadmin' : 'Admin'}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-primary)]">
                    {user?.email ?? '—'}
                  </p>
                </div>
                <div className="px-2 py-2 space-y-0.5">
                  <button
                    onClick={() => openModal('info')}
                    className="w-full rounded-sm px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] transition hover:bg-gray-50"
                  >
                    Change Information
                  </button>
                  <button
                    onClick={() => openModal('password')}
                    className="w-full rounded-sm px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] transition hover:bg-gray-50"
                  >
                    Change Password
                  </button>
                  <div className="my-1 border-t border-[var(--line)]" />
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-sm px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      <div className="w-full">
        {children}
      </div>

      {/* Profile modals */}
      {profileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-8 py-6">
              <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)]">
                {profileModal === 'info' ? 'Change Information' : 'Change Password'}
              </h3>
              <button onClick={closeModal} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none">×</button>
            </div>

            <div className="px-8 py-6">
              {modalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">{modalError}</div>
              )}
              {modalSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-sm">{modalSuccess}</div>
              )}

              {profileModal === 'info' && (
                <form onSubmit={handleInfoSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">Name</label>
                    <input
                      type="text"
                      value={infoForm.name}
                      onChange={(e) => setInfoForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder={user?.name || 'Name'}
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">Email</label>
                    <input
                      type="email"
                      value={infoForm.email}
                      onChange={(e) => setInfoForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder={user?.email || 'Email'}
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2 border-t border-[var(--line)]">
                    <button type="button" onClick={closeModal} className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition disabled:opacity-60">
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {profileModal === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Current Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                      autoFocus
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="Current password"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      New Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="New password"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Confirm New Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2 border-t border-[var(--line)]">
                    <button type="button" onClick={closeModal} className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition disabled:opacity-60">
                      {submitting ? 'Saving...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
