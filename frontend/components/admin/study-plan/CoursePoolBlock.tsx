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
  onSave: () => void;
}

export function CoursePoolBlock({
  pools,
  onRemoveCourseFromPool,
  onCreatePool,
  onDeletePool,
  poolCatalog,
  onSave
}: CoursePoolBlockProps) {
  const [newPoolName, setNewPoolName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreatePool = () => {
    if (!newPoolName) return;
    onCreatePool(newPoolName);
    setNewPoolName('');
  };

  const filteredCatalog = poolCatalog.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="flex h-[500px] w-64 shrink-0 flex-col rounded border border-[var(--line)] bg-[var(--surface-muted)] p-4">
          <h3 className="mb-2 text-center text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-primary)]">Pool Courses Catalog</h3>
          <div className="mb-3">
            <input 
              type="text" 
              placeholder="Search code/title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-full border border-[var(--line)] bg-white px-2 text-[0.65rem] focus:border-[var(--up-gold)] focus:outline-none"
            />
          </div>
          <div className="modern-scrollbar overflow-y-auto overflow-x-hidden pr-1">
            <div className="flex flex-col gap-3">
            {filteredCatalog.map((course) => (
              <DraggablePaletteCourse key={`pool_${course.course_id || course.code}`} id={`pool_${course.course_id || course.code}`} course={course} />
            ))}
            {filteredCatalog.length === 0 && searchTerm && (
              <p className="text-center text-[0.6rem] text-gray-400 mt-4">No matching courses</p>
            )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--line)] mt-6 pt-4">
        <button className="border border-[var(--text-muted)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50">Discard</button>
        <button 
          onClick={onSave}
          className="border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-8 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709]"
        >
          Save Course Pool
        </button>
      </div>
    </section>
  );
}
