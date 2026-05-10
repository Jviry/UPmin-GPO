'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/admin/LoadingScreen';

// Added Announcements to the navigation array
const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Programs', href: '/admin/programs' },
  { label: 'Scholarships', href: '/admin/scholarships' },
  { label: 'Announcements', href: '/admin/announcements' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isSuperadmin = user?.role === 'superadmin';

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
                  pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin') 
                    ? 'text-[var(--up-maroon)] font-semibold' 
                    : ''
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
                <div className="px-2 py-2">
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
    </div>
  );
}