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

  return (
    <div>
      {error && !modalMode && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
      )}

      <div className="mb-4 flex flex-col border border-[var(--line)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Admin List</h3>
          <button
            onClick={openAddModal}
            className="px-6 py-2 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition"
          >
            + Add Admin
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">No admins found.</div>
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
              {admins.map((admin, index) => (
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
                    <button
                      onClick={() => openEditModal(admin)}
                      className="px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] border border-[var(--text-muted)] hover:bg-gray-50 transition mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(admin)}
                      className="px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-red-600 border border-red-200 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
