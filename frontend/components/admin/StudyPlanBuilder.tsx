'use client';

import { useState } from 'react';
import { DndContext, pointerWithin, DragOverlay } from '@dnd-kit/core';

import { Course, StudyPlanTrack, Pool } from './study-plan/SharedDnd';
import { MasterCatalogBlock } from './study-plan/MasterCatalogBlock';
import { StudyPlanBlock } from './study-plan/StudyPlanBlock';
import { CoursePoolBlock } from './study-plan/CoursePoolBlock';

export function StudyPlanBuilder({ programId }: { programId: number | null }) {
  const [catalog, setCatalog] = useState<Course[]>([
    { code: 'MATH 26', name: 'Advanced Mathematics', units: 3, type: 'core' },
    { code: 'CMSC 126', name: 'Theory of Computation', units: 3, type: 'core' },
    { code: 'CMSC 203', name: 'Advanced Algorithms', units: 3, type: 'pool' },
    { code: 'ABME 399', name: 'Graduate Seminar 1', units: 1, type: 'pool' },
  ]);

  const [tracks, setTracks] = useState<StudyPlanTrack[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [corePlacements, setCorePlacements] = useState<Record<string, Record<string, (Course & { instanceId: string })[]>>>({});
  
  const [pools, setPools] = useState<Pool[]>([
    { id: 'pool_electives', name: 'Electives', courses: [] },
  ]);

  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // --- Handlers ---
  const handleAddCourse = (course: Course) => {
    setCatalog(prev => [...prev, course]);
  };

  const handleCreateTrack = (name: string, years: number) => {
    const newId = `track_${Date.now()}`;
    setTracks(prev => [...prev, { id: newId, name, years }]);
    if (!activeTrackId) setActiveTrackId(newId);
  };

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

  const handleCreatePool = (name: string) => {
    setPools(prev => [...prev, { id: `pool_${Date.now()}`, name, courses: [] }]);
  };

  const handleDeletePool = (poolId: string) => {
    setPools(prev => prev.filter(p => p.id !== poolId));
  };

  const handleRemoveCourseFromTrack = (instanceId: string, trackId: string, semId: string) => {
    setCorePlacements(prev => ({
      ...prev,
      [trackId]: {
        ...prev[trackId],
        [semId]: (prev[trackId]?.[semId] || []).filter(c => c.instanceId !== instanceId)
      }
    }));
  };

  const handleRemoveCourseFromPool = (instanceId: string, poolId: string) => {
    setPools(prev => prev.map(p => p.id === poolId ? { ...p, courses: p.courses.filter(c => c.instanceId !== instanceId) } : p));
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
          handleRemoveCourseFromPool(instanceId, sourceBucketId);
        } else if (activeTrackId) {
          handleRemoveCourseFromTrack(instanceId, activeTrackId, sourceBucketId);
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
  const coreCatalog = catalog.filter(c => c.type === 'core');
  const poolCatalog = catalog.filter(c => c.type === 'pool');

  return (
    <DndContext 
      collisionDetection={pointerWithin} 
      onDragStart={(e) => setActiveCourse(e.active.data.current?.course)} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-8">
        <MasterCatalogBlock onAddCourse={handleAddCourse} />

        <StudyPlanBlock 
          tracks={tracks}
          activeTrackId={activeTrackId}
          setActiveTrackId={setActiveTrackId}
          corePlacements={corePlacements}
          onRemoveCourse={handleRemoveCourseFromTrack}
          onCreateTrack={handleCreateTrack}
          onDeleteTrack={handleDeleteTrack}
          coreCatalog={coreCatalog}
        />

        <CoursePoolBlock 
          pools={pools}
          onRemoveCourseFromPool={handleRemoveCourseFromPool}
          onCreatePool={handleCreatePool}
          onDeletePool={handleDeletePool}
          poolCatalog={poolCatalog}
        />
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
