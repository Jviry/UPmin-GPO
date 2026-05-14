'use client';

import { useState } from 'react';
import { 
  Course, 
  StudyPlanTrack, 
  generateSemesters, 
  DraggablePaletteCourse, 
  DroppableBucket 
} from './SharedDnd';

interface StudyPlanBlockProps {
  tracks: StudyPlanTrack[];
  activeTrackId: string | null;
  setActiveTrackId: (id: string | null) => void;
  corePlacements: Record<string, Record<string, (Course & { instanceId: string })[]>>;
  onRemoveCourse: (instanceId: string, trackId: string, semId: string) => void;
  onCreateTrack: (name: string, years: number) => void;
  onDeleteTrack: (id: string) => void;
  coreCatalog: Course[];
}

export function StudyPlanBlock({
  tracks,
  activeTrackId,
  setActiveTrackId,
  corePlacements,
  onRemoveCourse,
  onCreateTrack,
  onDeleteTrack,
  coreCatalog
}: StudyPlanBlockProps) {
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanYears, setNewPlanYears] = useState<number>(2);

  const activeTrack = tracks.find(t => t.id === activeTrackId);
  const semesters = activeTrack ? generateSemesters(activeTrack.years) : [];

  const handleCreateTrack = () => {
    if (!newPlanName || newPlanYears < 1) return;
    onCreateTrack(newPlanName, newPlanYears);
    setNewPlanName('');
    setNewPlanYears(2);
  };

  return (
    <section className="flex flex-col border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-4">
        <h2 className="text-lg font-bold uppercase tracking-widest text-[var(--up-maroon)]" style={{ fontFamily: 'var(--font-display)' }}>Study Plan</h2>
        
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            value={newPlanName} 
            onChange={e => setNewPlanName(e.target.value)} 
            className="h-8 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-xs focus:border-[var(--up-gold)] focus:outline-none w-48" 
            placeholder="Plan Name (e.g., Master's)" 
          />
          <div className="flex items-center gap-2">
            <label className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Years:</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={newPlanYears} 
              onChange={e => setNewPlanYears(Number(e.target.value))} 
              className="h-8 w-16 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-xs focus:border-[var(--up-gold)] focus:outline-none" 
            />
          </div>
          <button onClick={handleCreateTrack} className="h-8 border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-4 text-[0.6rem] font-bold uppercase tracking-widest text-white transition hover:bg-[#5c0709]">
            Create Plan
          </button>
        </div>
      </div>

      {tracks.length > 0 && (
        <div className="flex gap-2 mb-4 border-b border-[var(--line)]">
          {tracks.map(track => (
            <div 
              key={track.id} 
              className={`flex items-center transition-colors ${activeTrackId === track.id ? 'border-b-2 border-[var(--up-maroon)] bg-white' : 'hover:bg-[var(--surface-muted)]'}`}
            >
              <button 
                onClick={() => setActiveTrackId(track.id)} 
                className={`px-4 py-2.5 text-[0.65rem] font-bold uppercase tracking-widest ${activeTrackId === track.id ? 'text-[var(--up-maroon)]' : 'text-[var(--text-muted)]'}`}
              >
                {track.name} ({track.years} Yrs)
              </button>
              <button 
                onClick={() => onDeleteTrack(track.id)} 
                className={`pr-4 text-xs ${activeTrackId === track.id ? 'text-red-400 hover:text-red-700' : 'text-transparent hover:text-red-500'}`}
                title="Delete Study Plan"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-1 rounded border border-[var(--line)] bg-white p-4">
          {activeTrackId ? (
            <div className="grid grid-cols-2 gap-4">
              {semesters.map((sem) => (
                <DroppableBucket 
                  key={sem.id} 
                  id={sem.id} 
                  label={sem.label} 
                  bucketType="semester"
                  placedCourses={corePlacements[activeTrackId]?.[sem.id] || []}
                  onRemove={(instanceId) => onRemoveCourse(instanceId, activeTrackId, sem.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest text-center px-4">
              Create a study plan above to begin placing core courses.
            </div>
          )}
        </div>

        <div className="w-64 shrink-0 flex flex-col rounded border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <h3 className="mb-4 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-primary)]">Core Courses Catalog</h3>
          <div className="modern-scrollbar flex-1 overflow-y-auto space-y-3 pr-1 h-[400px]">
            {coreCatalog.map((course) => (
              <DraggablePaletteCourse key={`core_${course.code}`} id={`core_${course.code}`} course={course} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--line)] mt-6 pt-4">
        <button className="border border-[var(--text-muted)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Discard</button>
        <button className="border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">
          Save Study Plan
        </button>
      </div>
    </section>
  );
}
