'use client';

import { useState, useEffect } from 'react';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, verifyPassword } from '@/services/apiServices';

interface Admin {
  admin_id: number;
  name: string;
  email: string;
  role: string;
}

type ModalMode = 'add' | 'verify' | 'edit' | 'delete-verify';

const EMPTY_ADD_FORM = { name: '', email: '', password: '', role: 'admin' };

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Add form
  const [addForm, setAddForm] = useState(EMPTY_ADD_FORM);

  // Verification step
  const [verifyPasswordInput, setVerifyPasswordInput] = useState('');

  // Edit form
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', newPassword: '' });

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      setAdmins(await getAdmins());
    } catch (err: any) {
      setError(err.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setAddForm(EMPTY_ADD_FORM);
    setError(null);
    setModalMode('add');
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setVerifyPasswordInput('');
    setEditForm({ name: admin.name, email: admin.email, role: admin.role, newPassword: '' });
    setError(null);
    setModalMode('verify');
  };

  const openDeleteModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setVerifyPasswordInput('');
    setError(null);
    setModalMode('delete-verify');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingAdmin(null);
    setVerifyPasswordInput('');
    setEditForm({ name: '', email: '', role: '', newPassword: '' });
    setAddForm(EMPTY_ADD_FORM);
    setError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.password.trim()) {
      setError('All fields are required');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await createAdmin(addForm);
      closeModal();
      await loadAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPasswordInput.trim()) {
      setError('Please enter your password');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await verifyPassword(verifyPasswordInput);
      setModalMode('edit');
    } catch (err: any) {
      setError(err.message || 'Incorrect password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setError('Name and email are required');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await updateAdmin(editingAdmin!.admin_id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        newPassword: editForm.newPassword || undefined,
      });
      closeModal();
      await loadAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed to update admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPasswordInput.trim()) {
      setError('Please enter your password');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await verifyPassword(verifyPasswordInput);
      await deleteAdmin(editingAdmin!.admin_id);
      closeModal();
      await loadAdmins();
    } catch (err: any) {
      setError(err.message || 'Incorrect password');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAdmins = [...admins]
    .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const displayedAdmins = filteredAdmins.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const emptyRows = PAGE_SIZE - displayedAdmins.length;

  return (
    <div>
      {error && !modalMode && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
      )}

      <div className="mb-4 flex flex-col border border-[var(--line)] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Admin List</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="h-8 w-48 border border-[var(--line)] bg-white pl-8 pr-3 text-[0.72rem] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:border-[var(--up-maroon)] focus:outline-none"
              />
            </div>
            <button
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="flex h-8 items-center gap-1.5 border border-[var(--line)] bg-white px-3 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[var(--text-secondary)] transition hover:bg-gray-50"
              title={sortOrder === 'asc' ? 'Name: A → Z (click to reverse)' : 'Name: Z → A (click to reverse)'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={sortOrder === 'asc' ? 'M3 4h13M3 8h9M3 12h5m8 0l3 3m0 0l3-3m-3 3V8' : 'M3 4h13M3 8h9M3 12h5m8 8l3-3m0 0l3 3m-3-3V8'} />
              </svg>
              {sortOrder === 'asc' ? 'A–Z' : 'Z–A'}
            </button>
            <button
              onClick={openAddModal}
              className="h-8 bg-[var(--up-maroon)] px-5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]"
            >
              + Add Admin
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">No admins found.</div>
        ) : displayedAdmins.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-muted)] text-sm">No results match &ldquo;{searchQuery}&rdquo;.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-muted)]">
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Name</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Email</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Role</th>
                <th className="text-right py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedAdmins.map((admin, index) => (
                <tr key={admin.admin_id} className={`border-b border-[var(--line)] hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'}`}>
                  <td className="py-4 px-6 font-semibold text-[var(--text-primary)]">{admin.name}</td>
                  <td className="py-4 px-6 text-[var(--text-secondary)]">{admin.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block rounded px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest ${
                      admin.role === 'superadmin' ? 'bg-[var(--up-maroon)] text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="p-1.5 text-[var(--text-secondary)] border border-[var(--text-muted)] hover:bg-gray-50 transition"
                          aria-label="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z" />
                          </svg>
                        </button>
                        <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap bg-gray-800 px-2 py-0.5 text-[0.6rem] text-white opacity-0 transition group-hover:opacity-100">
                          Edit
                        </span>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => openDeleteModal(admin)}
                          className="p-1.5 text-red-600 border border-red-200 hover:bg-red-50 transition"
                          aria-label="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-1 1H9z" />
                          </svg>
                        </button>
                        <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap bg-gray-800 px-2 py-0.5 text-[0.6rem] text-white opacity-0 transition group-hover:opacity-100">
                          Delete
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`empty-${i}`} className={`border-b border-[var(--line)] ${(displayedAdmins.length + i) % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'}`}>
                  <td className="py-4 px-6">&nbsp;</td>
                  <td className="py-4 px-6" />
                  <td className="py-4 px-6" />
                  <td className="py-4 px-6" />
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && admins.length > 0 && filteredAdmins.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--line)] px-6 py-4">
            <span className="text-[0.7rem] text-[var(--text-muted)]">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredAdmins.length)} of {filteredAdmins.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.15em] border border-[var(--line)] text-[var(--text-secondary)] hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1.5 text-[0.7rem] font-bold border transition ${
                    p === safePage
                      ? 'bg-[var(--up-maroon)] border-[var(--up-maroon)] text-white'
                      : 'border-[var(--line)] text-[var(--text-secondary)] hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.15em] border border-[var(--line)] text-[var(--text-secondary)] hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg max-w-lg w-full">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-8 py-6">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)]">
                  {modalMode === 'add' && 'Add Admin'}
                  {modalMode === 'verify' && 'Verify Identity'}
                  {modalMode === 'edit' && 'Edit Admin'}
                  {modalMode === 'delete-verify' && 'Confirm Deletion'}
                </h3>
                {modalMode === 'verify' && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Enter your password to edit <span className="font-semibold text-[var(--text-primary)]">{editingAdmin?.name}</span>
                  </p>
                )}
                {modalMode === 'edit' && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Editing {editingAdmin?.name}</p>
                )}
                {modalMode === 'delete-verify' && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Verify your identity to proceed</p>
                )}
              </div>
              <button onClick={closeModal} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none">×</button>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
              )}

              {/* ADD FORM */}
              {modalMode === 'add' && (
                <form onSubmit={handleAddSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={addForm.name}
                      onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={addForm.email}
                      onChange={(e) => setAddForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={addForm.password}
                      onChange={(e) => setAddForm(f => ({ ...f, password: e.target.value }))}
                      minLength={8}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="Password"
                    />
                    {addForm.password && addForm.password.length < 8 && (
                      <p className="mt-1.5 text-[0.65rem] text-red-500">Must be at least 8 characters</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Role <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={addForm.role}
                      onChange={(e) => setAddForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--up-maroon)]"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>
                  <div className="flex gap-3 justify-end pt-2 border-t border-[var(--line)]">
                    <button type="button" onClick={closeModal} className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition disabled:opacity-60">
                      {submitting ? 'Creating...' : 'Create Admin'}
                    </button>
                  </div>
                </form>
              )}

              {/* DELETE VERIFY STEP */}
              {modalMode === 'delete-verify' && (
                <form onSubmit={handleDeleteVerifySubmit} className="space-y-5">
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                    </svg>
                    <span>
                      You are about to permanently delete <span className="font-semibold">{editingAdmin?.name}</span>. This cannot be undone. Enter your password to confirm.
                    </span>
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Your Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={verifyPasswordInput}
                      onChange={(e) => setVerifyPasswordInput(e.target.value)}
                      autoFocus
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-red-500"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2 border-t border-[var(--line)]">
                    <button type="button" onClick={closeModal} className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-10 py-2.5 bg-red-600 text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-red-700 transition disabled:opacity-60">
                      {submitting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                  </div>
                </form>
              )}

              {/* VERIFY STEP */}
              {modalMode === 'verify' && (
                <form onSubmit={handleVerifySubmit} className="space-y-5">
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                    </svg>
                    <span>Confirm your identity before making changes to another admin's account.</span>
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Your Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={verifyPasswordInput}
                      onChange={(e) => setVerifyPasswordInput(e.target.value)}
                      autoFocus
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2 border-t border-[var(--line)]">
                    <button type="button" onClick={closeModal} className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition disabled:opacity-60">
                      {submitting ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </form>
              )}

              {/* EDIT FORM */}
              {modalMode === 'edit' && (
                <form onSubmit={handleEditSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">Role</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--up-maroon)]"
                    >
                      <option value="admin" disabled={editingAdmin?.role === 'superadmin'}>Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                    {editingAdmin?.role === 'superadmin' && (
                      <p className="mt-1.5 text-[0.65rem] text-[var(--text-muted)]">Superadmin role cannot be downgraded.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      New Password <span className="text-[0.6rem] font-normal normal-case tracking-normal text-[var(--text-muted)]">(leave blank to keep current)</span>
                    </label>
                    <input
                      type="password"
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm(f => ({ ...f, newPassword: e.target.value }))}
                      minLength={8}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="Leave blank to keep current password"
                    />
                    {editForm.newPassword && editForm.newPassword.length < 8 && (
                      <p className="mt-1.5 text-[0.65rem] text-red-500">Must be at least 8 characters</p>
                    )}
                  </div>
                  <div className="flex gap-3 justify-end pt-2 border-t border-[var(--line)]">
                    <button type="button" onClick={closeModal} className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition disabled:opacity-60">
                      {submitting ? 'Saving...' : 'Save Changes'}
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
