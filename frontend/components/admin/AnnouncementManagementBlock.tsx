'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/apiClient';

type Announcement = {
  announcement_id: number;
  title: string;
  image_url: string | null;
  content_description: string;
  attached_link: string | null;
  date_posted: string;
  admin_id: number;
};

export function AnnouncementManagementBlock() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content_description: '',
    attached_link: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/announcements');
      setAnnouncements(res.data.announcements || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      title: '',
      content_description: '',
      attached_link: '',
    });
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsModalOpen(true);
  };

  const handleEditClick = (announcement: Announcement) => {
    setEditingId(announcement.announcement_id);
    setFormData({
      title: announcement.title,
      content_description: announcement.content_description,
      attached_link: announcement.attached_link || '',
    });
    setImageFile(null);
    setImagePreview(announcement.image_url || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content_description.trim()) {
      setError('Please fill in the title and description.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);

      // Create FormData for multipart upload
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('content_description', formData.content_description);
      if (formData.attached_link) {
        submitFormData.append('attached_link', formData.attached_link);
      }
      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      if (editingId) {
        await apiClient.put(`/announcements/${editingId}`, submitFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await apiClient.post('/announcements', submitFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setIsModalOpen(false);
      await loadAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      setError(null);
      // Changed to plural /announcements/
      await apiClient.delete(`/announcements/${id}`);
      await loadAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete announcement');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      title: '',
      content_description: '',
      attached_link: '',
    });
    if (imagePreview && !imageFile && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mb-10 border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Announcement Management
        </h2>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-4">
          <input
            type="text"
            placeholder="Search Announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full max-w-[300px] border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="bg-[var(--up-maroon)] px-6 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]"
        >
          + Add Announcement
        </button>
      </div>

      {/* Announcements List Block */}
      <div className="flex flex-col border border-[var(--line)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">Announcements List</h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            Loading announcements...
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            No announcements found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0">
                <tr className="border-b border-[var(--line)] bg-[var(--surface-muted)]">
                  <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Image</th>
                  <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Title</th>
                  <th className="text-left py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Date Posted</th>
                  <th className="text-right py-3 px-6 font-bold uppercase tracking-widest text-[0.6rem] text-[var(--text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.map((announcement, index) => (
                  <tr
                    key={announcement.announcement_id}
                    className={`border-b border-[var(--line)] hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-[var(--page-bg)]'}`}
                  >
                    <td className="py-4 px-6">
                      {announcement.image_url ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${announcement.image_url}`}
                          alt={announcement.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[var(--text-secondary)] font-semibold">
                      {announcement.title}
                    </td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">
                      {new Date(announcement.date_posted).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleEditClick(announcement)}
                        className="px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] border border-[var(--text-muted)] hover:bg-gray-50 transition mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.announcement_id)}
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

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-[var(--line)] px-8 py-6 bg-white z-10">
              <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--text-primary)]">
                {editingId ? 'Edit Announcement' : 'Add Announcement'}
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

              {/* Image Upload to replace prev Image URL */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Cover Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded border border-[var(--line)]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imagePreview && !imageFile && imagePreview.startsWith('blob:')) {
                            URL.revokeObjectURL(imagePreview);
                          }
                          setImageFile(null);
                          setImagePreview('');
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Box Section */}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--line)] cursor-pointer bg-[var(--bg-secondary)] hover:border-[var(--up-maroon)] transition-colors rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                  </svg>
                  {imageFile ? (
                    <span className="text-[0.7rem] text-[var(--up-maroon)] font-semibold">{imageFile.name}</span>
                  ) : imagePreview && !imageFile ? (
                    <span className="text-[0.7rem] text-[var(--text-secondary)]">Current image: {imagePreview.split('/').pop()?.slice(-30)}</span>
                  ) : (
                    <span className="text-[0.7rem] text-[var(--text-muted)]">Click to upload cover image</span>
                  )}
                  <span className="text-[0.65rem] text-[var(--text-muted)] mt-1">PNG, JPG, GIF up to 5MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="Announcement title"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.content_description}
                  onChange={(e) => handleInputChange('content_description', e.target.value)}
                  className="w-full min-h-[120px] resize-none px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="Enter the full announcement details here..."
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3">
                  Attached Link
                </label>
                <input
                  type="text"
                  value={formData.attached_link}
                  onChange={(e) => handleInputChange('attached_link', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--line)] text-[var(--text-secondary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--up-maroon)]"
                  placeholder="https://... (Optional)"
                />
              </div>

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
                  disabled={submitting}
                  className="px-10 py-2.5 bg-[var(--up-maroon)] text-white text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0709] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (editingId ? 'Updating...' : 'Posting...') : (editingId ? 'Update' : 'Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
