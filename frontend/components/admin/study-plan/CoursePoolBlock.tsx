'use client';

import { useState } from 'react';
import { 
  Course, 
  Pool, 
  DraggablePaletteCourse, 
  DroppableBucket 
} from './SharedDnd';

interface CoursePoolBlockProps {
  pools: Pool[];
  onRemoveCourseFromPool: (instanceId: string, poolId: string) => void;
  onCreatePool: (name: string) => void;
  onDeletePool: (id: string) => void;
  poolCatalog: Course[];
}

export function CoursePoolBlock({
  pools,
  onRemoveCourseFromPool,
  onCreatePool,
  onDeletePool,
  poolCatalog
}: CoursePoolBlockProps) {
  const [newPoolName, setNewPoolName] = useState('');

  const handleCreatePool = () => {
    if (!newPoolName) return;
    onCreatePool(newPoolName);
    setNewPoolName('');
  };

  return (
    <section className="flex flex-col border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-4">
        <h2 className="text-lg font-bold uppercase tracking-widest text-[var(--up-maroon)]" style={{ fontFamily: 'var(--font-display)' }}>Course Pool Builder</h2>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={newPoolName} 
            onChange={e => setNewPoolName(e.target.value)} 
            className="h-8 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-xs focus:border-[var(--up-gold)] focus:outline-none" 
            placeholder="e.g. Electives, Seminars" 
          />
          <button onClick={handleCreatePool} className="h-8 border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-4 text-[0.6rem] font-bold uppercase tracking-widest text-white transition hover:bg-[#5c0709]">
            Create Pool
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 rounded border border-[var(--line)] bg-white p-4">
           <div className="grid grid-cols-2 gap-4">
              {pools.map((pool) => (
                <DroppableBucket 
                  key={pool.id} 
                  id={pool.id} 
                  label={pool.name} 
                  bucketType="pool"
                  placedCourses={pool.courses}
                  onRemove={(instanceId) => onRemoveCourseFromPool(instanceId, pool.id)}
                  onDeleteBucket={onDeletePool}
                />
              ))}
           </div>
        </div>

        <div className="w-64 shrink-0 flex flex-col rounded border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <h3 className="mb-4 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-primary)]">Pool Courses Catalog</h3>
          <div className="modern-scrollbar flex-1 overflow-y-auto space-y-3 pr-1 h-[400px]">
            {poolCatalog.map((course) => (
              <DraggablePaletteCourse key={`pool_${course.code}`} id={`pool_${course.code}`} course={course} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--line)] mt-6 pt-4">
        <button className="border border-[var(--text-muted)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Discard</button>
        <button className="border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]">
          Save Course Pool
        </button>
      </div>
    </section>
  );
}
