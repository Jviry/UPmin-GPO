'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();

  // Navigation map based on your Prisma schema entities
  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Curriculum Builder', path: '/admin/curriculum' },
    { name: 'Announcements', path: '/admin/announcements' },
    { name: 'Faculty & Depts', path: '/admin/faculty' },
    { name: 'Office Info', path: '/admin/office' },
    { name: 'Scholarships', path: '/admin/scholarships' },
    { name: 'Testimonies', path: '/admin/testimonies' },
    { name: 'Manage Admins', path: '/admin/users' },
  ];

  return (
    <aside className="flex w-64 flex-col bg-[var(--up-maroon)] text-white shadow-2xl z-20 h-screen shrink-0 sticky top-0">
      {/* Branding Header */}
      <div className="flex h-16 items-center px-6 border-b border-white/10 shrink-0">
        <h1 className="font-bold tracking-widest text-lg uppercase text-[var(--up-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
          GPO Admin
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto modern-scrollbar py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`block rounded-md px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-[var(--up-gold)] border-l-4 border-[var(--up-gold)] shadow-inner' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile / Logout Area */}
      <div className="p-4 border-t border-white/10 shrink-0 bg-black/10">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-[var(--up-gold)] flex items-center justify-center text-[var(--up-maroon)] font-bold text-xs shrink-0">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Superadmin</p>
            <button className="text-xs text-white/50 hover:text-white hover:underline uppercase tracking-wider transition-colors mt-0.5 block">
              Log out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}