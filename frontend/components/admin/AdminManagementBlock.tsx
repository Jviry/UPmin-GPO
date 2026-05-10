'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

type Admin = {
  admin_id: number;
  name: string;
  email: string;
  role: string;
};

export function AdminManagementBlock() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    password: '',
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/admins');
      setAdmins(res.data.admins || res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (admin: Admin) => {
    setEditingId(admin.admin_id);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      password: '', // Password left blank intentionally when editing
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || (!editingId && !formData.password.trim())) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError(null);

      // If editing and password is empty, remove it from payload so it isn't updated
      const payload: any = { ...formData };
      if (editingId && !payload.password.trim()) {
        delete payload.password;
      }

      if (editingId) {
        await apiClient.put(`/admin/${editingId}`, payload);
      } else {
        await apiClient.post('/admin', payload);
      }

      setIsModalOpen(false);
      await loadAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save admin');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this administrator?')) {
      return;
    }

    try {
      setError(null);
      await apiClient.delete(`/admin/${id}`);
      await loadAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete admin');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      password: '',
    });
    setError(null);
  };

  return (
    <section className="mb-10 border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Admin Management
        </h2>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Admin List Block (Mirrors Faculty List Design) */}
      <div className="flex flex-col border border-[var(--line)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Admin List</h3>
          <button
            onClick={handleAddClick}
            className="px-6 py-2 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition"
          >
            + Add Admin
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            Loading admins...
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            No administrators found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0">
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
                    <td className="py-4 px-6 text-[var(--text-secondary)] font-semibold">{admin.name}</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">{admin.email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block rounded px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest ${
                        admin.role === 'superadmin' 
                          ? 'bg-[var(--up-maroon)] text-white shadow-sm' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleEditClick(admin)}
                        className="px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] border border-[var(--text-muted)] hover:bg-gray-50 transition mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin.admin_id)}
                        className="px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-red-600 border border-red-200 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal (Mirrors Add Faculty Popup Design) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--line)] px-8 py-6 bg-white z-10">
              <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)]">
                {editingId ? 'Edit Administrator' : 'Add Administrator'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="Administrator full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="admin@example.com"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Role <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--up-maroon)]"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Password {!editingId && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder={editingId ? "Leave blank to keep current password" : "Assign a temporary password"}
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-[var(--line)] mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition"
                >
                  {editingId ? 'Update' : 'Create'} Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}