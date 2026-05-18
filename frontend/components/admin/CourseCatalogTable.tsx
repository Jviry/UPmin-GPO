'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { Course, CourseType } from './study-plan/SharedDnd';

export function CourseCatalogTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [newCourse, setNewCourse] = useState<Course>({ 
    code: '', 
    name: '', 
    units: 3, 
    type: 'core' 
  });

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/courses', {
        params: { page, limit, search }
      });
      setCourses(res.data.courses);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, search]);

  const handleSaveToDatabase = async () => {
    if (!newCourse.code || !newCourse.name) return;
    try {
      await apiClient.post('/courses', newCourse);
      alert('Course saved to database!');
      setNewCourse({ code: '', name: '', units: 3, type: 'core' });
      fetchCourses();
    } catch (error: any) {
      console.error("Failed to save course:", error);
      alert(error.response?.data?.message || 'Failed to save course to database.');
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course? This might affect existing study plans.')) return;
    try {
      await apiClient.delete(`/courses/${id}`);
      fetchCourses();
    } catch (error: any) {
      console.error("Failed to delete course:", error);
      alert(error.response?.data?.message || 'Failed to delete course.');
    }
  };

  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Master Course Catalog
        </h2>
      </div>

      {/* Add Course Form */}
      <div className="mb-10 bg-[var(--surface-muted)] p-6 border border-[var(--line)]">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--up-maroon)]">
          Add New Course to Database
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Code</label>
            <input 
              type="text" 
              value={newCourse.code} 
              onChange={e => setNewCourse({...newCourse, code: e.target.value})} 
              className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-maroon)] focus:outline-none" 
              placeholder="e.g., CMSC 206" 
            />
          </div>
          <div>
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Title</label>
            <input 
              type="text" 
              value={newCourse.name} 
              onChange={e => setNewCourse({...newCourse, name: e.target.value})} 
              className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-maroon)] focus:outline-none" 
              placeholder="e.g., Artificial Intelligence" 
            />
          </div>
          <div>
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Units</label>
            <input 
              type="number" 
              value={newCourse.units || 0} 
              onChange={e => setNewCourse({...newCourse, units: Number(e.target.value)})} 
              min="1" 
              className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-maroon)] focus:outline-none" 
            />
          </div>
          <div>
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Category</label>
            <select 
              value={newCourse.type} 
              onChange={e => setNewCourse({...newCourse, type: e.target.value as CourseType})} 
              className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-maroon)] focus:outline-none"
            >
              <option value="core">Core Course (Study Plan)</option>
              <option value="pool">Pool Course (Electives, Seminars)</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--line)]">
          <button 
            onClick={() => {
              setNewCourse({ code: '', name: '', units: 3, type: 'core' });
            }} 
            className="border border-[var(--text-muted)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50"
          >
            Clear
          </button>
          <button 
            onClick={handleSaveToDatabase}
            className="border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]"
          >
            Save to Database
          </button>
        </div>
      </div>

      {/* Search and Table */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-9 w-full border border-[var(--line)] bg-white pl-8 pr-3 text-xs focus:border-[var(--up-maroon)] focus:outline-none"
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
          <div className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Total: {total} Courses
          </div>
        </div>

        <div className="overflow-x-auto border border-[var(--line)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-muted)] text-[0.65rem] font-bold uppercase tracking-widest text-[var(--up-maroon)] border-b border-[var(--line)]">
              <tr>
                <th className="px-4 py-3 border-r border-[var(--line)]">Code</th>
                <th className="px-4 py-3 border-r border-[var(--line)]">Title</th>
                <th className="px-4 py-3 border-r border-[var(--line)] text-center">Units</th>
                <th className="px-4 py-3 border-r border-[var(--line)]">Type</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[var(--text-muted)]">Loading courses...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[var(--text-muted)]">No courses found.</td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.course_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-[var(--up-maroon)] border-r border-[var(--line)]">{course.code}</td>
                    <td className="px-4 py-3 text-[var(--text-primary)] border-r border-[var(--line)]">{course.name}</td>
                    <td className="px-4 py-3 text-center border-r border-[var(--line)]">{course.units}</td>
                    <td className="px-4 py-3 border-r border-[var(--line)]">
                      <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                        course.type === 'core' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {course.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="relative group">
                          <button 
                            onClick={() => handleDeleteCourse(course.course_id!)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-[var(--line)] text-xs disabled:opacity-50 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="text-xs font-bold text-[var(--text-muted)]">
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-[var(--line)] text-xs disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
