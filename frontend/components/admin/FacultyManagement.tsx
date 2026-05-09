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
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: 'Program Coordinator',
    credentials: [''],
    photo: '',
  });

  useEffect(() => {
    loadFaculty(currentPage);
  }, [currentPage]);

  const loadFaculty = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getFaculty(undefined, page, PAGE_SIZE);
      setFaculties(result.faculties || []);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setPhotoFile(null);
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
    setPhotoFile(null);
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
      
      const credentials = formData.credentials.filter(c => c.trim());

      if (editingId) {
        await updateFaculty(editingId, {
          name: formData.name,
          email: formData.email,
          position: formData.position,
          credentials,
          photoFile,
          existingPhoto: formData.photo || undefined,
        });
      } else {
        await createFaculty({
          name: formData.name,
          email: formData.email,
          position: formData.position,
          credentials,
          photoFile,
        });
      }

      setIsModalOpen(false);
      const targetPage = editingId ? currentPage : 1;
      if (!editingId) setCurrentPage(1);
      await loadFaculty(targetPage);
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
      const newTotal = totalCount - 1;
      const newLastPage = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
      const targetPage = Math.min(currentPage, newLastPage);
      setCurrentPage(targetPage);
      await loadFaculty(targetPage);
    } catch (err: any) {
      setError(err.message || 'Failed to delete faculty');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setPhotoFile(null);
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
        <div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--line)] px-6 py-4">
              <span className="text-[0.7rem] text-[var(--text-muted)]">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.15em] border border-[var(--line)] text-[var(--text-secondary)] hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1.5 text-[0.7rem] font-bold border transition ${
                      p === currentPage
                        ? 'bg-[var(--up-maroon)] border-[var(--up-maroon)] text-white'
                        : 'border-[var(--line)] text-[var(--text-secondary)] hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.15em] border border-[var(--line)] text-[var(--text-secondary)] hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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

              {/* Photo Upload */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Photo
                </label>
                <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-[var(--line)] cursor-pointer bg-[var(--bg-secondary)] hover:border-[var(--up-maroon)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                  </svg>
                  {photoFile ? (
                    <span className="text-[0.7rem] text-[var(--up-maroon)] font-semibold">{photoFile.name}</span>
                  ) : formData.photo ? (
                    <span className="text-[0.7rem] text-[var(--text-secondary)]">{formData.photo}</span>
                  ) : (
                    <span className="text-[0.7rem] text-[var(--text-muted)]">Click to upload photo</span>
                  )}
                  <span className="text-[0.65rem] text-[var(--text-muted)] mt-1">PNG, JPG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  />
                </label>
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
