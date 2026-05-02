'use client';

import { useState, useEffect } from "react";
import PlaceholderProfileImg from "@/components/PlaceholderProfileImg";
import { getOfficeInfo, getTestimonies, getCoordinators } from "../services/apiServices";

export default function AboutGPO() {
  const [office, setOffice] = useState<any>(null);
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        // Fetch all data concurrently for better performance
        const [officeData, facultyData, testimoniesData] = await Promise.all([
          getOfficeInfo().catch(() => null),
          getCoordinators().catch(() => []),
          getTestimonies().catch(() => [])
        ]);

        setOffice(officeData);
        setCoordinators(facultyData);
        setTestimonies(testimoniesData);
      } catch (error) {
        console.error("Error loading About GPO data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--up-maroon)]">Loading...</div>;
  }

  return (
    <div className="w-full">
      {/* Header + Org Chart */}
      <section className="bg-white border-b-4 border-[var(--up-gold)] pb-0">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <h1 className="text-5xl md:text-6xl leading-tight text-[var(--up-maroon)]" style={{ fontFamily: 'var(--font-display)' }}>
            About the Graduate Program Office
          </h1>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed whitespace-pre-wrap">
            {office?.history || "Placeholder office history text."}
          </p>
        </div>
        <div className="bg-[var(--up-maroon)] border-t-4 border-[var(--up-gold)] py-12 w-full">
          <div className="max-w-6xl mx-auto px-4 h-96">
             {/* If you have an Org Chart image in your Office schema later, you can replace this */}
            <PlaceholderProfileImg className="h-full" />
          </div>
        </div>
      </section>

      {/* Program Coordinators */}
      <section className="bg-white border-b-4 border-[var(--up-gold)] py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-[var(--up-maroon)]" style={{ fontFamily: 'var(--font-display)' }}>
            Program Coordinators
          </h2>
          <div className="flex flex-row flex-wrap">
            {coordinators.map((faculty) => (
              <div
                key={faculty.faculty_id}
                className="flex flex-col w-1/2 sm:w-1/3 lg:w-1/4 border-r border-[var(--line)] last:border-r-0 px-6 pb-8 pt-2"
              >
                {/* Image area with gold bottom bar only */}
                <div className="relative w-full aspect-[3/4] bg-[var(--surface-muted)]">
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    {faculty.photo ? (
                       <img 
                         src={`http://localhost:3001${faculty.photo}`} 
                         alt={faculty.name} 
                         className="w-full h-full object-cover" 
                       />
                    ) : (
                      <PlaceholderProfileImg className="border-0 rounded-none" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-[var(--up-gold)]" />
                </div>
                {/* Program pill */}
                <div className="pt-4">
                  <span className="inline-block bg-[var(--up-maroon)] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {/* Assuming backend includes the Department relation */}
                    {faculty.department?.name || "Program Coordinator"}
                  </span>
                </div>
                {/* Name and role */}
                <div className="pt-3">
                  <div className="font-bold text-base uppercase tracking-wider text-[var(--text-primary)]">
                    {faculty.name}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mt-1">
                    {faculty.position}
                  </div>
                </div>
              </div>
            ))}
            
            {coordinators.length === 0 && (
              <div className="text-[var(--text-secondary)]">No coordinators assigned yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Graduate Testimonials */}
      <section className="bg-[var(--up-maroon)] border-t-4 border-[var(--up-gold)] border-b-4 py-16">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row gap-0">
          {/* Left: title */}
          <div className="md:w-2/5 flex flex-col justify-start pr-10 pb-10 md:pb-0">
            <h2
              className="text-4xl sm:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What Our<br />Graduates Say
            </h2>
            <div className="mt-6 w-10 h-0.5 bg-white/50" />
          </div>
          {/* Vertical divider */}
          <div className="hidden md:block w-px bg-white/20 mx-2" />
          {/* Right: testimonies */}
          <div className="md:w-3/5 flex flex-col pl-0 md:pl-10 gap-0 divide-y divide-white/10">
            {testimonies.map((testimony) => (
              <div key={testimony.testimony_id} className="py-8 first:pt-0 last:pb-0">
                <div className="text-white/30 text-6xl leading-none mb-2 select-none" style={{ fontFamily: 'var(--font-display)', lineHeight: 1 }}>&ldquo;</div>
                <p className="text-white text-lg leading-relaxed mb-5">"{testimony.testimony_description}"</p>
                <div className="text-[var(--up-gold)] font-bold text-xs uppercase tracking-widest">
                  {testimony.alumnus_name}
                </div>
                <div className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">
                  {testimony.alumnus_graduate_program}
                </div>
              </div>
            ))}
            
            {testimonies.length === 0 && (
              <div className="text-white/50 py-4">No testimonies available.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}