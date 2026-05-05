'use client';

import { useState } from 'react';
import { DndContext, pointerWithin, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';

// --- Types ---
type CourseType = 'core' | 'pool';

type Course = {
  code: string;
  name: string;
  units: number;
  type: CourseType;
};

type StudyPlanTrack = {
  id: string;
  name: string;
  years: number;
};

// --- Helper Functions ---
const generateSemesters = (years: number) => {
  const semesters = [];
  const yearLabels = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
  
  for (let y = 0; y < years; y++) {
    const yearLabel = yearLabels[y] || `${y + 1}th`;
    semesters.push({ id: `y${y+1}-s1`, label: `${yearLabel} Year, 1st Sem` });
    semesters.push({ id: `y${y+1}-s2`, label: `${yearLabel} Year, 2nd Sem` });
  }
  return semesters;
};

// --- Sub-Components ---

function DraggablePaletteCourse({ id, course }: { id: string; course: Course }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { course, isPaletteItem: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded border border-[var(--line)] bg-white p-2.5 shadow-sm transition hover:border-[var(--up-gold)] active:cursor-grabbing ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="font-bold text-[var(--text-primary)] text-xs">{course.code}</p>
        <span className="rounded bg-gray-100 px-1 py-0.5 text-[0.55rem] text-gray-600">{course.units}U</span>
      </div>
      <p className="mt-0.5 text-[0.65rem] text-[var(--text-secondary)] truncate">{course.name}</p>
    </div>
  );
}

function DraggablePlacedCourse({ course, instanceId, bucketId, onRemove }: { course: Course; instanceId: string; bucketId: string; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: instanceId,
    data: { course, isPlacedItem: true, instanceId, sourceBucketId: bucketId },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group relative flex cursor-grab items-center justify-between rounded border border-gray-200 bg-white p-2 shadow-sm transition active:cursor-grabbing ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div>
        <p className="text-[0.65rem] font-bold text-gray-700">{course.code}</p>
        <p className="text-[0.55rem] text-gray-500 truncate w-28">{course.name}</p>
      </div>
      <button 
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(instanceId)}
        className="hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 text-xs"
      >
        ×
      </button>
    </div>
  );
}

// UPDATED: Added onDeleteBucket to handle Pool deletion
function DroppableBucket({ id, label, placedCourses, onRemove, bucketType, onDeleteBucket }: { id: string; label: string; placedCourses: (Course & { instanceId: string })[]; onRemove: (instanceId: string) => void, bucketType: 'semester' | 'pool', onDeleteBucket?: (id: string) => void }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[120px] rounded border-2 p-3 transition-colors ${
        isOver 
          ? 'border-[var(--up-maroon)] bg-red-50/50' 
          : 'border-[var(--line)] bg-[var(--surface-muted)]'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <h4 className="flex-1 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--up-maroon)]">
          {label}
        </h4>
        {onDeleteBucket && (
          <button 
            onClick={() => onDeleteBucket(id)} 
            className="ml-2 text-red-400 transition hover:text-red-700"
            title="Delete Pool"
          >
            ×
          </button>
        )}
      </div>
      <div className="flex-1 space-y-2">
        {placedCourses.map((c) => (
          <DraggablePlacedCourse 
            key={c.instanceId} 
            course={c} 
            instanceId={c.instanceId} 
            bucketId={id} 
            onRemove={onRemove} 
          />
        ))}
        {placedCourses.length === 0 && (
          <div className="flex h-full items-center justify-center text-[0.6rem] font-semibold tracking-widest text-gray-400 text-center px-2">
            Drop {bucketType === 'semester' ? 'Core' : 'Pool'} Courses Here
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---

export function StudyPlanBuilder({ programId }: { programId: number | null }) {
  const [catalog, setCatalog] = useState<Course[]>([
    { code: 'MATH 26', name: 'Advanced Mathematics', units: 3, type: 'core' },
    { code: 'CMSC 126', name: 'Theory of Computation', units: 3, type: 'core' },
    { code: 'CMSC 203', name: 'Advanced Algorithms', units: 3, type: 'pool' },
    { code: 'ABME 399', name: 'Graduate Seminar 1', units: 1, type: 'pool' },
  ]);

  const [newCourse, setNewCourse] = useState({ code: '', name: '', units: 3, type: 'core' as CourseType });

  const [tracks, setTracks] = useState<StudyPlanTrack[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [corePlacements, setCorePlacements] = useState<Record<string, Record<string, (Course & { instanceId: string })[]>>>({});
  
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanYears, setNewPlanYears] = useState<number>(2);

  const [pools, setPools] = useState<{ id: string, name: string, courses: (Course & { instanceId: string })[] }[]>([
    { id: 'pool_electives', name: 'Electives', courses: [] },
  ]);
  const [newPoolName, setNewPoolName] = useState('');

  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // --- Handlers ---
  const handleAddCourse = () => {
    if (!newCourse.code || !newCourse.name) return;
    setCatalog(prev => [...prev, newCourse]);
    setNewCourse({ code: '', name: '', units: 3, type: 'core' }); 
  };

  const handleCreateTrack = () => {
    if (!newPlanName || newPlanYears < 1) return;
    const newId = `track_${Date.now()}`;
    setTracks(prev => [...prev, { id: newId, name: newPlanName, years: newPlanYears }]);
    if (!activeTrackId) setActiveTrackId(newId);
    setNewPlanName('');
    setNewPlanYears(2);
  };

  // NEW: Handler for deleting a track
  const handleDeleteTrack = (trackId: string) => {
    setTracks(prev => {
      const remaining = prev.filter(t => t.id !== trackId);
      if (activeTrackId === trackId) {
        setActiveTrackId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
    setCorePlacements(prev => {
      const newPlacements = { ...prev };
      delete newPlacements[trackId];
      return newPlacements;
    });
  };

  const handleCreatePool = () => {
    if (!newPoolName) return;
    setPools(prev => [...prev, { id: `pool_${Date.now()}`, name: newPoolName, courses: [] }]);
    setNewPoolName('');
  };

  // NEW: Handler for deleting a pool
  const handleDeletePool = (poolId: string) => {
    setPools(prev => prev.filter(p => p.id !== poolId));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveCourse(null);

    const activeData = active.data.current || {};
    const { course, isPaletteItem, isPlacedItem, instanceId, sourceBucketId } = activeData;

    if (!course) return;

    if (!over) {
      if (isPlacedItem) {
        if (sourceBucketId.startsWith('pool_')) {
          setPools(prev => prev.map(p => p.id === sourceBucketId ? { ...p, courses: p.courses.filter(c => c.instanceId !== instanceId) } : p));
        } else if (activeTrackId) {
          setCorePlacements(prev => ({
            ...prev,
            [activeTrackId]: {
              ...(prev[activeTrackId] || {}),
              [sourceBucketId]: (prev[activeTrackId]?.[sourceBucketId] || []).filter(c => c.instanceId !== instanceId)
            }
          }));
        }
      }
      return;
    }

    const overId = String(over.id);

    if (isPaletteItem) {
      const newInstance = { ...course, instanceId: `${course.code}_${Date.now()}` };

      if (course.type === 'core' && !overId.startsWith('pool_') && activeTrackId) {
        setCorePlacements((prev) => ({
          ...prev,
          [activeTrackId]: {
            ...(prev[activeTrackId] || {}),
            [overId]: [...((prev[activeTrackId] || {})[overId] || []), newInstance],
          }
        }));
      } 
      else if (course.type === 'pool' && overId.startsWith('pool_')) {
        setPools(prev => prev.map(pool => 
          pool.id === overId 
            ? { ...pool, courses: [...pool.courses, newInstance] } 
            : pool
        ));
      }
    } 
    else if (isPlacedItem) {
      if (sourceBucketId === overId) return;

      const isOverPool = overId.startsWith('pool_');
      
      if (course.type === 'core' && isOverPool) return;
      if (course.type === 'pool' && !isOverPool) return;

      const newInstance = { ...course, instanceId }; 

      if (course.type === 'core' && !isOverPool && activeTrackId) {
        setCorePlacements(prev => {
          const currentTrack = prev[activeTrackId] || {};
          const sourceList = (currentTrack[sourceBucketId] || []).filter(c => c.instanceId !== instanceId);
          const targetList = [...(currentTrack[overId] || []), newInstance];
          return {
            ...prev,
            [activeTrackId]: {
              ...currentTrack,
              [sourceBucketId]: sourceList,
              [overId]: targetList
            }
          };
        });
      } 
      else if (course.type === 'pool' && isOverPool) {
        setPools(prev => prev.map(p => {
          if (p.id === sourceBucketId) return { ...p, courses: p.courses.filter(c => c.instanceId !== instanceId) };
          if (p.id === overId) return { ...p, courses: [...p.courses, newInstance] };
          return p;
        }));
      }
    }
  };

  // --- Derived Data ---
  const activeTrack = tracks.find(t => t.id === activeTrackId);
  const semesters = activeTrack ? generateSemesters(activeTrack.years) : [];
  const coreCatalog = catalog.filter(c => c.type === 'core');
  const poolCatalog = catalog.filter(c => c.type === 'pool');

  return (
    <DndContext collisionDetection={pointerWithin} onDragStart={(e) => setActiveCourse(e.active.data.current?.course)} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-8">

        {/* --- SECTION 1: ADD COURSE TO MASTER CATALOG --- */}
        <div className="flex flex-col border border-[var(--line)] bg-[var(--surface-muted)] p-6 shadow-sm">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--up-maroon)]">
            Add New Course to Database
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-4">
              <div className="w-1/3">
                <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Code</label>
                <input type="text" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" placeholder="e.g., CMSC 206" />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Title</label>
                <input type="text" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" placeholder="e.g., Artificial Intelligence" />
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="w-1/3">
                <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Units</label>
                <input type="number" value={newCourse.units} onChange={e => setNewCourse({...newCourse, units: Number(e.target.value)})} min="1" className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none" />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Course Category</label>
                <select value={newCourse.type} onChange={e => setNewCourse({...newCourse, type: e.target.value as CourseType})} className="h-10 w-full border border-[var(--line)] bg-white px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none">
                  <option value="core">Core Course (Study Plan)</option>
                  <option value="pool">Pool Course (Electives, Seminars)</option>
                </select>
              </div>
              <button onClick={handleAddCourse} className="h-10 shrink-0 border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-8 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">
                Add to Catalog
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: STUDY PLAN BUILDER --- */}
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

          {/* UPDATED: Tabs now have an inner delete button */}
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
                    onClick={() => handleDeleteTrack(track.id)} 
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
                    <DroppableBucket key={sem.id} id={sem.id} label={sem.label} bucketType="semester"
                      placedCourses={corePlacements[activeTrackId]?.[sem.id] || []}
                      onRemove={(instanceId) => setCorePlacements(prev => ({ ...prev, [activeTrackId]: { ...prev[activeTrackId], [sem.id]: prev[activeTrackId][sem.id].filter(c => c.instanceId !== instanceId) } }))}
                    />
                  ))}
                </div>
              ) : <div className="flex h-full min-h-[200px] items-center justify-center text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest text-center px-4">Create a study plan above to begin placing core courses.</div>}
            </div>

            <div className="w-64 shrink-0 flex flex-col rounded border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <h3 className="mb-4 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-primary)]">Core Courses Catalog</h3>
              <div className="modern-scrollbar flex-1 overflow-y-auto space-y-3 pr-1 h-[400px]">
                {coreCatalog.map((course) => <DraggablePaletteCourse key={`core_${course.code}`} id={`core_${course.code}`} course={course} />)}
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: COURSE POOL BUILDER --- */}
        <section className="flex flex-col border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-[var(--up-maroon)]" style={{ fontFamily: 'var(--font-display)' }}>Course Pool Builder</h2>
            <div className="flex items-center gap-2">
              <input type="text" value={newPoolName} onChange={e => setNewPoolName(e.target.value)} className="h-8 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-xs focus:border-[var(--up-gold)] focus:outline-none" placeholder="e.g. Electives, Seminars" />
              <button onClick={handleCreatePool} className="h-8 border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-4 text-[0.6rem] font-bold uppercase tracking-widest text-white transition hover:bg-[#5c0709]">
                Create Pool
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 rounded border border-[var(--line)] bg-white p-4">
               <div className="grid grid-cols-2 gap-4">
                  {/* UPDATED: Pass onDeleteBucket to handle deleting the entire pool */}
                  {pools.map((pool) => (
                    <DroppableBucket key={pool.id} id={pool.id} label={pool.name} bucketType="pool"
                      placedCourses={pool.courses}
                      onRemove={(instanceId) => setPools(prev => prev.map(p => p.id === pool.id ? { ...p, courses: p.courses.filter(c => c.instanceId !== instanceId) } : p))}
                      onDeleteBucket={handleDeletePool}
                    />
                  ))}
               </div>
            </div>

            <div className="w-64 shrink-0 flex flex-col rounded border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <h3 className="mb-4 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-primary)]">Pool Courses Catalog</h3>
              <div className="modern-scrollbar flex-1 overflow-y-auto space-y-3 pr-1 h-[400px]">
                {poolCatalog.map((course) => <DraggablePaletteCourse key={`pool_${course.code}`} id={`pool_${course.code}`} course={course} />)}
              </div>
            </div>
          </div>
        </section>

      </div>

      <DragOverlay>
        {activeCourse ? (
            <div className="opacity-90 rotate-2 scale-105 transition-transform cursor-grabbing rounded border-2 border-[var(--up-gold)] bg-white p-3 shadow-2xl w-48 z-50">
              <div className="flex items-start justify-between">
                <p className="font-bold text-[var(--up-maroon)] text-xs">{activeCourse.code}</p>
                <span className="rounded bg-gray-100 px-1 py-0.5 text-[0.55rem] text-gray-600">{activeCourse.units}U</span>
              </div>
              <p className="mt-0.5 text-[0.65rem] text-[var(--text-secondary)] truncate">{activeCourse.name}</p>
            </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}