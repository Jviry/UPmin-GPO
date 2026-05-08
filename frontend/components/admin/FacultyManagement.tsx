'use client';

import { useState, useEffect } from 'react';
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from '@/services/apiServices';

interface Faculty {
  faculty_id: number;
  name: string;
  email: string;
  position: string;
  photo?: string;
  credentials?: Array<{ degree: string }>;
}

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: 'Program Coordinator',
    credentials: [''],
    photo: '',
  });

  // Load faculty on mount
  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFaculty();
      setFaculties(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      position: 'Program Coordinator',
      credentials: [''],
      photo: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (faculty: Faculty) => {
    setEditingId(faculty.faculty_id);
    setFormData({
      name: faculty.name,
      email: faculty.email,
      position: faculty.position,
      credentials: faculty.credentials?.map(c => c.degree) || [''],
      photo: faculty.photo || '',
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCredentialChange = (index: number, value: string) => {
    const newCredentials = [...formData.credentials];
    newCredentials[index] = value;
    setFormData(prev => ({
      ...prev,
      credentials: newCredentials
    }));
  };

  const addCredentialField = () => {
    setFormData(prev => ({
      ...prev,
      credentials: [...prev.credentials, '']
    }));
  };

  const removeCredentialField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      credentials: prev.credentials.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || formData.credentials.some(c => !c.trim())) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError(null);
      
      const payload = {
        name: formData.name,
        email: formData.email,
        position: formData.position,
        credentials: formData.credentials.filter(c => c.trim()),
        ...(formData.photo && { photo: formData.photo }),
      };

      if (editingId) {
        await updateFaculty(editingId, payload);
      } else {
        await createFaculty(payload);
      }

      setIsModalOpen(false);
      await loadFaculty();
    } catch (err: any) {
      setError(err.message || 'Failed to save faculty');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) {
      return;
    }

    try {
      setError(null);
      await deleteFaculty(id);
      await loadFaculty();
    } catch (err: any) {
      setError(err.message || 'Failed to delete faculty');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      position: 'Program Coordinator',
      credentials: [''],
      photo: '',
    });
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="mb-8 flex flex-col border border-[var(--line)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Faculty List</h3>
          <button
            onClick={handleAddClick}
            className="px-6 py-2 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition"
          >
            + Add Faculty
          </button>
        </div>

      {loading ? (
        <div className="text-center py-8 text-[var(--text-muted)]">
          Loading faculty...
        </div>
      ) : faculties.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-muted)]">
          No faculty members found.
        </div>
      ) : (
        <div className="modern-scrollbar max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0">
              <tr className="border-b border-[var(--line)] bg-[var(--surface-muted)]">
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Name</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Email</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Position</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Credentials</th>
                <th className="text-right py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty, index) => (
                <tr 
                  key={faculty.faculty_id} 
                  className={`border-b border-[var(--line)] hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'}`}
                >
                  <td className="py-4 px-6 text-[var(--text-secondary)] font-semibold">{faculty.name}</td>
                  <td className="py-4 px-6 text-[var(--text-secondary)]">{faculty.email}</td>
                  <td className="py-4 px-6 text-[var(--text-secondary)]">{faculty.position}</td>
                  <td className="py-4 px-6 text-[var(--text-secondary)] text-[0.85rem]">
                    {faculty.credentials && faculty.credentials.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {faculty.credentials.map((cred, idx) => (
                          <li key={idx}>{cred.degree}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEditClick(faculty)}
                      className="px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] border border-[var(--text-muted)] hover:bg-gray-50 transition mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faculty.faculty_id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--line)] px-8 py-6 bg-white">
              <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)]">
                {editingId ? 'Edit Faculty' : 'Add Faculty'}
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
                  placeholder="Faculty name"
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
                  placeholder="email@example.com"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Position <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--up-maroon)]"
                >
                  <option value="Program Coordinator">Program Coordinator</option>
                </select>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => handleInputChange('photo', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              {/* Credentials */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Credentials <span className="text-red-600">*</span>
                </label>
                <p className="text-[0.65rem] text-[var(--text-muted)] mb-4">
                  Add degrees or qualifications (e.g., "MS Computer Science")
                </p>
                {formData.credentials.map((credential, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={credential}
                      onChange={(e) => handleCredentialChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                      placeholder="Degree or credential"
                    />
                    {formData.credentials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCredentialField(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 font-medium text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCredentialField}
                  className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--up-maroon)] hover:underline"
                >
                  + Add Credential
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-[var(--line)]">
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
                  {editingId ? 'Update' : 'Create'} Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
