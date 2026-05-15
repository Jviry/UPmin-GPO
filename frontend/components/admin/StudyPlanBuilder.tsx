'use client';

import { useState, useEffect } from 'react';
import { DndContext, pointerWithin, DragOverlay } from '@dnd-kit/core';
import { apiClient } from '@/lib/apiClient';
import * as api from '@/services/apiServices';

import { Course, StudyPlanTrack, Pool } from './study-plan/SharedDnd';
import { StudyPlanBlock } from './study-plan/StudyPlanBlock';
import { CoursePoolBlock } from './study-plan/CoursePoolBlock';

export function StudyPlanBuilder({ programId }: { programId: number | null }) {
  const [catalog, setCatalog] = useState<Course[]>([]);
  const [tracks, setTracks] = useState<StudyPlanTrack[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [corePlacements, setCorePlacements] = useState<Record<string, Record<string, (Course & { instanceId: string })[]>>>({});
  
  const [pools, setPools] = useState<Pool[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!programId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(`/programs/${programId}`);
        const program = res.data.program || res.data;

        // 1. Tracks (Study Plans)
        const fetchedTracks: StudyPlanTrack[] = (program.study_plans || []).map((sp: any) => ({
          id: String(sp.study_plan_id),
          name: sp.name,
          years: sp.years
        }));
        setTracks(fetchedTracks);
        if (fetchedTracks.length > 0) setActiveTrackId(fetchedTracks[0].id);

        // 2. Placements
        const fetchedPlacements: Record<string, Record<string, (Course & { instanceId: string })[]>> = {};
        program.study_plans?.forEach((sp: any) => {
          const trackPlacements: Record<string, (Course & { instanceId: string })[]> = {};
          sp.program_courses?.forEach((pc: any) => {
            const semId = `y${pc.year}-s${pc.semester}`;
            if (!trackPlacements[semId]) trackPlacements[semId] = [];
            
            const courseData: Course = pc.is_elective_slot 
              ? { code: 'ELECTIVE', name: 'Elective Slot', units: null, type: 'pool', is_elective_slot: true }
              : { 
                  course_id: pc.course.course_id, 
                  code: pc.course.code, 
                  name: pc.course.name, 
                  units: pc.course.units, 
                  type: pc.course.type as any 
                };

            trackPlacements[semId].push({
              ...courseData,
              instanceId: `${courseData.code}_${pc.program_course_id || Math.random()}`
            });
          });
          fetchedPlacements[String(sp.study_plan_id)] = trackPlacements;
        });
        setCorePlacements(fetchedPlacements);

        // 3. Pools
        const fetchedPools: Pool[] = (program.course_pools || []).map((pool: any) => ({
          id: String(pool.course_pool_id),
          name: pool.name,
          courses: (pool.entries || []).map((entry: any) => ({
            course_id: entry.course.course_id,
            code: entry.course.code,
            name: entry.course.name,
            units: entry.course.units,
            type: entry.course.type,
            instanceId: `${entry.course.code}_${entry.course_pool_entry_id}`
          }))
        }));
        setPools(fetchedPools);

        // 4. Catalog
        const catalogRes = await apiClient.get('/courses', { params: { limit: 1000 } }).catch(() => ({ data: { courses: [] } }));
        setCatalog(catalogRes.data.courses || []);

      } catch (error) {
        console.error("Failed to fetch study plan data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  // --- Handlers ---
  const handleCreateTrack = async (name: string, years: number) => {
    if (!programId) return;
    try {
      const newTrack = await api.createStudyPlan(programId, { name, years });
      const track: StudyPlanTrack = {
        id: String(newTrack.study_plan_id),
        name: newTrack.name,
        years: newTrack.years
      };
      setTracks(prev => [...prev, track]);
      if (!activeTrackId) setActiveTrackId(track.id);
    } catch (error) {
      console.error("Failed to create study plan:", error);
      alert("Failed to create study plan");
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!programId) return;
    if (!confirm("Are you sure you want to delete this study plan?")) return;
    try {
      await api.deleteStudyPlan(programId, parseInt(trackId));
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
    } catch (error) {
      console.error("Failed to delete study plan:", error);
      alert("Failed to delete study plan");
    }
  };

  const handleCreatePool = async (name: string) => {
    if (!programId) return;
    try {
      const newPool = await api.createCoursePool(programId, { name });
      const pool: Pool = {
        id: String(newPool.course_pool_id),
        name: newPool.name,
        courses: []
      };
      setPools(prev => [...prev, pool]);
    } catch (error) {
      console.error("Failed to create course pool:", error);
      alert("Failed to create course pool");
    }
  };

  const handleDeletePool = async (poolId: string) => {
    if (!programId) return;
    if (!confirm("Are you sure you want to delete this course pool?")) return;
    try {
      await api.deleteCoursePool(programId, parseInt(poolId));
      setPools(prev => prev.filter(p => p.id !== poolId));
    } catch (error) {
      console.error("Failed to delete course pool:", error);
      alert("Failed to delete course pool");
    }
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
        if (sourceBucketId.startsWith('pool_') || sourceBucketId.startsWith('temp_pool_')) {
          handleRemoveCourseFromPool(instanceId, sourceBucketId);
        } else if (activeTrackId) {
          handleRemoveCourseFromTrack(instanceId, activeTrackId, sourceBucketId);
        }
      }
      return;
    }

    const overId = String(over.id);
    const isOverPool = overId.includes('pool');

    if (isPaletteItem) {
      const newInstance = { ...course, instanceId: `${course.code}_${Date.now()}` };

      if (course.type === 'core' && !isOverPool && activeTrackId) {
        setCorePlacements((prev) => ({
          ...prev,
          [activeTrackId]: {
            ...(prev[activeTrackId] || {}),
            [overId]: [...((prev[activeTrackId] || {})[overId] || []), newInstance],
          }
        }));
      } 
      else if (course.type === 'pool' && isOverPool) {
        setPools(prev => prev.map(pool => 
          pool.id === overId 
            ? { ...pool, courses: [...pool.courses, newInstance] } 
            : pool
        ));
      }
    } 
    else if (isPlacedItem) {
      if (sourceBucketId === overId) return;

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

  const handleSaveStudyPlans = async () => {
    if (!programId) return;
    if (!activeTrackId) {
      alert("Please select or create a study plan first.");
      return;
    }
    try {
      const placements = corePlacements[activeTrackId] || {};
      const courses = Object.entries(placements).flatMap(([semId, list]) => {
        const match = semId.match(/y(\d+)-s(\d+)/);
        const year = match ? parseInt(match[1]) : 1;
        const semester = match ? parseInt(match[2]) : 1;
        return list.map(c => ({
          course_id: c.is_elective_slot ? null : c.course_id!,
          is_elective_slot: !!c.is_elective_slot,
          year,
          semester
        }));
      });

      await api.syncStudyPlanEntries(programId, parseInt(activeTrackId), courses);
      alert('Study plan courses saved successfully!');
    } catch (error) {
      console.error("Failed to save study plan:", error);
      alert('Failed to save study plan courses.');
    }
  };

  const handleSaveCoursePools = async () => {
    if (!programId) return;
    try {
      // Sync each pool one by one since backend endpoint is per pool
      for (const pool of pools) {
        const courseIds = pool.courses
          .filter(c => !c.is_elective_slot && c.course_id)
          .map(c => c.course_id!);
        
        await api.syncCoursePoolEntries(programId, parseInt(pool.id), courseIds);
      }
      alert('All course pools saved successfully!');
    } catch (error) {
      console.error("Failed to save course pools:", error);
      alert('Failed to save some course pools.');
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center text-[var(--up-maroon)] font-bold uppercase tracking-widest">Loading Study Plan Data...</div>;

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
        <StudyPlanBlock 
          tracks={tracks}
          activeTrackId={activeTrackId}
          setActiveTrackId={setActiveTrackId}
          corePlacements={corePlacements}
          onRemoveCourse={handleRemoveCourseFromTrack}
          onCreateTrack={handleCreateTrack}
          onDeleteTrack={handleDeleteTrack}
          coreCatalog={coreCatalog}
          onSave={handleSaveStudyPlans}
        />

        <CoursePoolBlock 
          pools={pools}
          onRemoveCourseFromPool={handleRemoveCourseFromPool}
          onCreatePool={handleCreatePool}
          onDeletePool={handleDeletePool}
          poolCatalog={poolCatalog}
          onSave={handleSaveCoursePools}
        />
      </div>

      <DragOverlay>
        {activeCourse ? (
            <div className="opacity-90 rotate-2 scale-105 transition-transform cursor-grabbing rounded border-2 border-[var(--up-gold)] bg-white p-3 shadow-2xl w-48 z-50">
              <div className="flex items-start justify-between">
                <p className="font-bold text-[var(--up-maroon)] text-xs">{activeCourse.code}</p>
                <span className="rounded bg-gray-100 px-1 py-0.5 text-[0.55rem] text-gray-600">
                  {activeCourse.units !== null ? `${activeCourse.units}U` : '--'}
                </span>
              </div>
              <p className="mt-0.5 text-[0.65rem] text-[var(--text-secondary)] truncate">{activeCourse.name}</p>
            </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
