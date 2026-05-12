'use client';

import { useState, useEffect } from 'react';
import { getAdmins, createAdmin, updateAdminPassword, deleteAdmin } from '@/services/apiServices';

interface Admin {
  admin_id: number;
  name: string;
  email: string;
  role: string;
}

type ModalMode = 'add' | 'edit';

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdmins();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setAddForm({ name: '', email: '', password: '', role: 'admin' });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (admin: Admin) => {
    setModalMode('edit');
    setEditingAdmin(admin);
    setNewPassword('');
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
    setNewPassword('');
    setAddForm({ name: '', email: '', password: '', role: 'admin' });
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setError('New password is required');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await updateAdminPassword(editingAdmin!.admin_id, newPassword);
      closeModal();
      await loadAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (admin: Admin) => {
    if (!confirm(`Delete admin "${admin.name}"? This cannot be undone.`)) return;
    try {
      setError(null);
      await deleteAdmin(admin.admin_id);
      await loadAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed to delete admin');
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
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
                <tr
                  key={admin.admin_id}
                  className={`border-b border-[var(--line)] hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'}`}
                >
                  <td className="py-4 px-6 font-semibold text-[var(--text-primary)]">{admin.name}</td>
                  <td className="py-4 px-6 text-[var(--text-secondary)]">{admin.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block rounded px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest ${
                      admin.role === 'superadmin'
                        ? 'bg-[var(--up-maroon)] text-white'
                        : 'bg-gray-200 text-gray-700'
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
                      onClick={() => handleDelete(admin)}
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg max-w-lg w-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-8 py-6">
              <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)]">
                {modalMode === 'add' ? 'Add Admin' : 'Change Password'}
              </h3>
              <button
                onClick={closeModal}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <form onSubmit={modalMode === 'add' ? handleAddSubmit : handleEditSubmit} className="px-8 py-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
              )}

              {modalMode === 'add' ? (
                <>
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
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="Password"
                    />
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
                </>
              ) : (
                <>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Changing password for <span className="font-semibold">{editingAdmin?.name}</span>
                  </p>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">
                      New Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="New password"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-end pt-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : modalMode === 'add' ? 'Create Admin' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
