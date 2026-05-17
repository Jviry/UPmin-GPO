'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

type Scholarship = {
  scholarship_id: number;
  name: string;
  description: string;
  covered_programs: string;
  application_instructions: string;
  application_url: string;
  recommendation_url: string | null;
  contact_info: string;
  admin_id: number;
};

export function ScholarshipManagementBlock() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    covered_programs: '',
    description: '',
    application_instructions: '',
    application_url: '',
    recommendation_url: '',
    contact_info: '',
  });

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/scholarships');
      setScholarships(res.data.scholarships || res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      covered_programs: '',
      description: '',
      application_instructions: '',
      application_url: '',
      recommendation_url: '',
      contact_info: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (scholarship: Scholarship) => {
    setEditingId(scholarship.scholarship_id);
    setFormData({
      name: scholarship.name,
      covered_programs: scholarship.covered_programs,
      description: scholarship.description,
      application_instructions: scholarship.application_instructions,
      application_url: scholarship.application_url,
      recommendation_url: scholarship.recommendation_url || '',
      contact_info: scholarship.contact_info,
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
    
    if (
      !formData.name.trim() || 
      !formData.description.trim() || 
      !formData.covered_programs.trim() || 
      !formData.application_instructions.trim() || 
      !formData.application_url.trim() || 
      !formData.contact_info.trim()
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setError(null);

      // Changed endpoints to plural /scholarships
      if (editingId) {
        await apiClient.put(`/scholarships/${editingId}`, formData);
      } else {
        await apiClient.post('/scholarships', formData);
      }

      setIsModalOpen(false);
      await loadScholarships();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save scholarship');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) {
      return;
    }

    try {
      setError(null);
      // Changed endpoint to plural /scholarships
      await apiClient.delete(`/scholarships/${id}`);
      await loadScholarships();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete scholarship');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      covered_programs: '',
      description: '',
      application_instructions: '',
      application_url: '',
      recommendation_url: '',
      contact_info: '',
    });
    setError(null);
  };

  const filteredScholarships = [...scholarships]
    .filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.covered_programs.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  const totalPages = Math.max(1, Math.ceil(filteredScholarships.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const displayedScholarships = filteredScholarships.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const emptyRows = PAGE_SIZE - displayedScholarships.length;

  return (
    <section className="mb-10 border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Scholarships Management
        </h2>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col border border-[var(--line)] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Scholarships List</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by title..."
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
              onClick={handleAddClick}
              className="h-8 bg-[var(--up-maroon)] px-5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]"
            >
              + Add Scholarship
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            Loading scholarships...
          </div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            No scholarships found.
          </div>
        ) : displayedScholarships.length === 0 ? (
          <div className="py-8 text-center text-[var(--text-muted)] text-sm">No results match &ldquo;{searchQuery}&rdquo;.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0">
              <tr className="border-b border-[var(--line)] bg-[var(--surface-muted)]">
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Title</th>
                <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Covered Programs</th>
                <th className="text-right py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedScholarships.map((scholarship, index) => (
                <tr
                  key={scholarship.scholarship_id}
                  className={`border-b border-[var(--line)] hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'}`}
                >
                  <td className="py-4 px-6 text-[var(--text-secondary)] font-semibold">{scholarship.name}</td>
                  <td className="py-4 px-6 text-[var(--text-secondary)]">
                    <span className="inline-block rounded px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest bg-[var(--surface-muted)] border border-[var(--line)]">
                      {scholarship.covered_programs}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="relative group">
                        <button
                          onClick={() => handleEditClick(scholarship)}
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
                          onClick={() => handleDelete(scholarship.scholarship_id)}
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
              {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`empty-${i}`} className={`border-b border-[var(--line)] ${(displayedScholarships.length + i) % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'}`}>
                  <td className="py-4 px-6">&nbsp;</td>
                  <td className="py-4 px-6" />
                  <td className="py-4 px-6" />
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && scholarships.length > 0 && filteredScholarships.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--line)] px-6 py-4">
            <span className="text-[0.7rem] text-[var(--text-muted)]">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredScholarships.length)} of {filteredScholarships.length}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto modern-scrollbar">
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--line)] px-8 py-6 bg-white z-10">
              <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)]">
                {editingId ? 'Edit Scholarship' : 'Add Scholarship'}
              </h3>
              <button onClick={handleCloseModal} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="Scholarship Title"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Covered Programs <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.covered_programs}
                  onChange={(e) => handleInputChange('covered_programs', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="e.g. MSCS, MS Mathematics"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full min-h-[100px] resize-none px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="General description of the scholarship..."
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Application Instructions <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.application_instructions}
                  onChange={(e) => handleInputChange('application_instructions', e.target.value)}
                  className="w-full min-h-[100px] resize-none px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="Step-by-step instructions or requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                    Application URL <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.application_url}
                    onChange={(e) => handleInputChange('application_url', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                    Recommendation URL
                  </label>
                  <input
                    type="text"
                    value={formData.recommendation_url}
                    onChange={(e) => handleInputChange('recommendation_url', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                    placeholder="https://... (Optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Contact Info <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contact_info}
                  onChange={(e) => handleInputChange('contact_info', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="Email or phone number"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[var(--line)] mt-8">
                <button type="button" onClick={handleCloseModal} className="px-8 py-2.5 border border-[var(--text-muted)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition">
                  {editingId ? 'Update' : 'Save'} Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}