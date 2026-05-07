"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/admin/LoadingScreen";

export default function AdminDashboard() {
  const { isLoading } = useProtectedRoute();
  const { user, logout } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--line-strong)] px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-[var(--up-maroon)] text-white text-sm font-semibold hover:bg-[#5c0709] transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-4xl">
          <div className="bg-white rounded-lg border border-[var(--line-strong)] p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Welcome back!</h2>
            <p className="text-[var(--text-muted)] mb-4">
              You are logged in as:
            </p>
            
            {user && (
              <div className="bg-[var(--page-bg)] rounded p-4 mb-6">
                <p className="text-sm font-mono text-[var(--text-secondary)]">
                  Admin ID: <span className="font-semibold">{user.admin_id}</span>
                </p>
                <p className="text-sm font-mono text-[var(--text-secondary)]">
                  Role: <span className="font-semibold">{user.role}</span>
                </p>
              </div>
            )}

            <p className="text-sm text-[var(--text-muted)]">
              This is a protected page. You can only see this if you're logged in.
              Your authentication token is automatically included in all API requests.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-[var(--line-strong)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Announcements</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">Manage program announcements</p>
              <a href="#" className="text-[var(--up-maroon)] font-semibold hover:underline">View →</a>
            </div>

            <div className="bg-white rounded-lg border border-[var(--line-strong)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Programs</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">Manage graduate programs</p>
              <a href="#" className="text-[var(--up-maroon)] font-semibold hover:underline">View →</a>
            </div>

            <div className="bg-white rounded-lg border border-[var(--line-strong)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Faculty</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">Manage faculty members</p>
              <a href="#" className="text-[var(--up-maroon)] font-semibold hover:underline">View →</a>
            </div>

            <div className="bg-white rounded-lg border border-[var(--line-strong)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Courses</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">Manage course offerings</p>
              <a href="#" className="text-[var(--up-maroon)] font-semibold hover:underline">View →</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
