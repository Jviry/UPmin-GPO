'use client';

import { useState } from 'react';
import { Course, CourseType } from './SharedDnd';

interface MasterCatalogBlockProps {
  onAddCourse: (course: Course) => void;
}

export function MasterCatalogBlock({ onAddCourse }: MasterCatalogBlockProps) {
  const [newCourse, setNewCourse] = useState<Course>({ 
    code: '', 
    name: '', 
    units: 3, 
    type: 'core' 
  });

  const handleAddCourse = () => {
    if (!newCourse.code || !newCourse.name) return;
    onAddCourse(newCourse);
    setNewCourse({ code: '', name: '', units: 3, type: 'core' }); 
  };

  const handleSaveToDatabase = async () => {
    if (!newCourse.code || !newCourse.name) return;
    try {
      await apiClient.post('/courses', newCourse);
      onAddCourse(newCourse);
      setNewCourse({ code: '', name: '', units: 3, type: 'core' });
      alert('Course saved to database!');
    } catch (error) {
      console.error("Failed to save course:", error);
      alert('Failed to save course to database.');
    }
  };

  return (
    <div className="flex flex-col border border-[var(--line)] bg-[var(--surface-muted)] p-6 shadow-sm">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--up-maroon)]">
        Add New Course to Database
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-4">
          <div className="w-1/3">
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Code</label>
            <input 
              type="text" 
              value={newCourse.code} 
              onChange={e => setNewCourse({...newCourse, code: e.target.value})} 
              className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" 
              placeholder="e.g., CMSC 206" 
            />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Title</label>
            <input 
              type="text" 
              value={newCourse.name} 
              onChange={e => setNewCourse({...newCourse, name: e.target.value})} 
              className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" 
              placeholder="e.g., Artificial Intelligence" 
            />
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div className="w-1/3">
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Units</label>
            <input 
              type="number" 
              value={newCourse.units} 
              onChange={e => setNewCourse({...newCourse, units: Number(e.target.value)})} 
              min="1" 
              className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" 
            />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Category</label>
            <select 
              value={newCourse.type} 
              onChange={e => setNewCourse({...newCourse, type: e.target.value as CourseType})} 
              className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            >
              <option value="core">Core Course (Study Plan)</option>
              <option value="pool">Pool Course (Electives, Seminars)</option>
            </select>
          </div>
          <button 
            onClick={handleAddCourse} 
            className="h-10 shrink-0 border border-[var(--line)] bg-white px-8 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50"
          >
            Add to Catalog
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-[var(--line)] mt-6 pt-4">
        <button 
          onClick={() => setNewCourse({ code: '', name: '', units: 3, type: 'core' })} 
          className="border border-[var(--text-muted)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveToDatabase}
          className="border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]"
        >
          Save Course to Database
        </button>
      </div>
    </div>
  );
}
