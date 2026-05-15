'use client';

import { useState, useEffect } from 'react';
import FacultyImage from '@/components/FacultyImage';
import apiClient, { getImageUrl } from '@/lib/apiClient';

type ActiveTab = 'structure' | 'application' | 'faculty';

// Reusable UI Blocks
function CourseRows({ courses }: { courses: any[] }) {
  return (
    <div className="w-full overflow-hidden rounded-sm border border-[rgba(118,9,12,0.15)]">
      {courses.map((course, index) => (
        <div
          key={course.code || index}
          className={`flex items-center justify-between gap-4 px-4 py-3 text-sm text-[var(--text-primary)] sm:px-6 sm:text-[0.95rem] ${index % 2 === 0 ? 'bg-[rgba(118,9,12,0.07)]' : 'bg-[rgba(118,9,12,0.13)]'
            }`}
        >
          <span className="w-24 shrink-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--up-maroon)] sm:text-sm">
            {course.code}
          </span>
          <span className="flex-1">{course.name}</span>
          <span className="shrink-0 text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
            {course.units} Units
          </span>
        </div>
      ))}
      {courses.length === 0 && (
        <div className="px-4 py-3 text-sm text-[var(--text-muted)] italic">No courses mapped yet.</div>
      )}
    </div>
  );
}

function StructureSummaryRows({ summary }: { summary: any[] }) {
  return (
    <div className="w-full overflow-hidden rounded-sm border border-[rgba(1,68,33,0.25)]">
      {summary.map((row, index) => (
        <div
          key={row.category}
          className={`flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 ${index % 2 === 0 ? 'bg-[rgba(1,68,33,0.12)]' : 'bg-[rgba(1,68,33,0.20)]'
            } ${index < summary.length - 1 ? 'border-b border-[rgba(1,68,33,0.25)]' : ''}`}
        >
          <span className="text-sm leading-tight text-[var(--text-primary)] sm:text-[0.95rem]">
            {row.category}
          </span>
          <span className="shrink-0 text-sm font-medium uppercase leading-tight text-[var(--text-primary)] sm:text-[0.95rem]">
            {row.units} Units
          </span>
        </div>
      ))}
      {summary.length === 0 && (
        <div className="px-4 py-2.5 text-sm text-[var(--text-muted)] italic">Summary unavailable.</div>
      )}
    </div>
  );
}

export function GraduateProgramDetail({ programId }: { programId: string }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('structure');
  const [program, setProgram] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await apiClient.get(`/programs/${programId}`);
        setProgram(res.data.program || res.data);
      } catch (error) {
        console.error("Failed to fetch program:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (programId) fetchProgram();
  }, [programId]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-[var(--up-maroon)]">Loading...</div>;
  }

  if (!program) {
    return <div className="flex min-h-screen items-center justify-center text-[var(--text-muted)]">Program not found.</div>;
  }

  // --- DATA MAPPING ---

  const descriptionParagraphs = program.description ? program.description.split('\n').filter(Boolean) : [];

  // Structure: Summary Calculations
  const structureSummary = program.course_pools?.map((pool: any) => ({
    category: pool.name,
    units: pool.entries?.reduce((sum: number, e: any) => sum + (e.course?.units || 0), 0) || 0
  })) || [];

  const totalUnits = structureSummary.reduce((sum: number, s: any) => sum + s.units, 0);
  if (structureSummary.length > 0) {
    structureSummary.push({ category: 'Total', units: totalUnits });
  }

  // Structure: Study Plan Grouping (By Year & Semester, including courses)
  const studyPlans = program.study_plans?.map((plan: any) => {
    const termsMap = new Map<string, { year: number; sem: number; units: number; courses: any[] }>();
    plan.program_courses?.forEach((pc: any) => {
      const key = `${pc.year}-${pc.semester}`;
      const existing = termsMap.get(key) || { year: pc.year, sem: pc.semester, units: 0, courses: [] as any[] };

      const courseUnits = pc.course?.units || (pc.is_elective_slot ? 3 : 0);
      existing.units += courseUnits;

      if (pc.course) {
        existing.courses.push(pc.course);
      } else if (pc.is_elective_slot) {
        existing.courses.push({ code: 'Elective', name: 'Elective Slot', units: 3 });
      }

      termsMap.set(key, existing);
    });
    const terms = Array.from(termsMap.values()).sort((a, b) => a.year === b.year ? a.sem - b.sem : a.year - b.year);
    return {
      label: plan.name || `${plan.years} Year Plan`,
      terms
    };
  }) || [];

  // Application Data
  const appQualifications = program.program_application?.qualifications || "Please refer to the general GPO guidelines.";
  const appInstructions = program.program_application?.application_instructions
    ? program.program_application.application_instructions.split('\n').filter(Boolean)
    : ["No specific instructions provided."];
  const appRequirements = program.programForms?.length > 0
    ? program.programForms.map((f: any) => f.name)
    : ["No specific file requirements listed."];

  // Faculty Data (Mapped directly from the program using the correct relation name)
  const facultyList = program.faculties?.map((pf: any) => pf.faculty) || [];

  return (
    <>
      <section id="introduction" className="border-b-4 border-[var(--up-gold)] bg-[var(--up-maroon)] px-4 pb-20 pt-16 text-white sm:px-6 lg:px-10 lg:pt-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <h1 className="max-w-[14ch] [font-family:var(--font-display)] text-[2.75rem] font-bold leading-[0.94] sm:text-[3.6rem] lg:text-[4.35rem]">
            {program.name}
          </h1>

          <div className="mt-8 max-w-[1120px] space-y-6 text-[0.96rem] font-normal leading-8 text-[rgba(255,255,255,0.94)] sm:text-[1rem] sm:leading-8 lg:mt-10 lg:text-[1.08rem] lg:leading-9">
            {descriptionParagraphs.map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-[var(--header-height)] z-40 -mt-10 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1200px] bg-[var(--up-green)] px-4 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.22)] sm:px-8">
          <nav className="grid grid-cols-3 gap-2 text-center text-xs font-medium uppercase tracking-[0.18em] sm:text-sm sm:tracking-[0.22em]">
            {(['structure', 'application', 'faculty'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded px-2 py-2 transition-colors duration-200 ${activeTab === tab
                  ? 'text-[var(--up-gold)]'
                  : 'text-[rgba(255,255,255,0.92)] hover:text-[var(--up-gold)]'
                  }`}
              >
                {tab === 'structure' ? 'Structure' : tab === 'application' ? 'Application' : 'Faculty'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'structure' && (
        <>
          <section id="program-structure" className="border-b-4 border-[var(--up-gold)] px-4 pb-16 pt-20 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="space-y-6">
                <h2 className="[font-family:var(--font-display)] text-4xl font-bold text-[var(--text-primary)] md:text-5xl lg:text-[4rem]">
                  Program Structure
                </h2>
                <p className="text-[0.95rem] leading-7 text-[var(--text-secondary)] sm:text-[1rem]">
                  To obtain the degree, the student must complete {totalUnits} units, a refereed publication and where relevant to the thesis, proof of language proficiency.
                </p>
                <StructureSummaryRows summary={structureSummary} />
              </div>

              <hr className="mt-10 border-[var(--line-strong)]" />

              <div className="mt-12 space-y-12">
                {program.course_pools?.map((pool: any) => (
                  <div key={pool.course_pool_id} className="grid items-start gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-10">
                    <h3 className="[font-family:var(--font-display)] text-[2.2rem] font-bold leading-tight text-[var(--text-primary)] sm:text-[2.6rem]">
                      {pool.name}
                    </h3>
                    <CourseRows courses={pool.entries?.map((e: any) => e.course) || []} />
                  </div>
                ))}
                {(!program.course_pools || program.course_pools.length === 0) && (
                  <p className="text-[var(--text-muted)]">Course structure details are currently unavailable.</p>
                )}
              </div>
            </div>
          </section>

          <section id="study-plan" className="border-b-4 border-[var(--up-gold)] bg-[var(--up-maroon)] px-4 pb-16 pt-12 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-[1200px]">
              <div>
                <h2 className="[font-family:var(--font-display)] text-4xl font-bold text-white md:text-5xl lg:text-[4rem]">
                  Study Plan
                </h2>
                <div className="mt-3 h-[3px] w-16 bg-[var(--up-gold)]" />
              </div>

              <div className="mt-9 grid gap-6 md:grid-cols-2 md:gap-8">
                {studyPlans.map((plan: any) => (
                  <div key={plan.label} className="overflow-hidden rounded-sm border border-[rgba(118,9,12,0.15)] bg-white shadow-[0_16px_28px_rgba(0,0,0,0.22)]">
                    <div className="border-b border-[rgba(118,9,12,0.15)] bg-[rgba(118,9,12,0.18)] px-5 py-3.5">
                      <p className="[font-family:var(--font-display)] text-lg font-bold text-[var(--up-maroon)]">{plan.label}</p>
                    </div>
                    {plan.terms.length > 0 ? plan.terms.map((term: any, i: number) => {
                      const sem = term.sem === 1 ? '1st Semester' : term.sem === 2 ? '2nd Semester' : 'Summer';
                      return (
                        <div
                          key={i}
                          className={`flex flex-col gap-2 px-5 py-3 ${i % 2 === 0 ? 'bg-[rgba(118,9,12,0.07)]' : 'bg-[rgba(118,9,12,0.13)]'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-widest text-[var(--text-primary)] font-bold">Year {term.year} - {sem}</span>
                            <span className="shrink-0 text-xs font-medium text-[var(--text-muted)]">{term.units} units</span>
                          </div>
                          {/* Course List inside the Semester */}
                          {term.courses.length > 0 && (
                            <ul className="text-xs text-[var(--text-secondary)] list-disc pl-4 mt-1 space-y-1">
                              {term.courses.map((c: any, idx: number) => (
                                <li key={idx}>{c.code ? `${c.code} - ${c.name}` : c.name}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    }) : (
                      <div className="px-5 py-3 text-xs text-[var(--text-muted)] italic">No courses planned yet.</div>
                    )}
                  </div>
                ))}
                {studyPlans.length === 0 && (
                  <p className="text-gray-300 col-span-2">Study plans are currently unavailable.</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'application' && (
        <>
          <div className="h-16 bg-[var(--page-bg)]" />

          {/* Qualifications */}
          <div className="bg-[var(--up-maroon)] px-4 py-20 sm:px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-14">
              <h2 className="[font-family:var(--font-display)] text-3xl font-bold leading-tight text-white sm:text-4xl">
                Qualifications
              </h2>
              <p className="text-[0.95rem] leading-7 text-[rgba(255,255,255,0.88)] sm:text-[1rem] whitespace-pre-wrap">
                {appQualifications}
              </p>
            </div>
          </div>

          <div className="h-8 bg-[var(--page-bg)]" />

          {/* Instructions for Applicants */}
          <div className="bg-[var(--up-maroon)] px-4 py-20 sm:px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-14">
              <h2 className="[font-family:var(--font-display)] text-3xl font-bold leading-tight text-white sm:text-4xl">
                Instructions<br />for Applicants
              </h2>
              <ol className="list-decimal space-y-1 pl-5 text-[0.95rem] leading-7 text-[rgba(255,255,255,0.88)] sm:text-[1rem]">
                {appInstructions.map((item: string, i: number) => (
                  <li key={i} className="font-semibold">{item}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="h-8 bg-[var(--page-bg)]" />

          {/* Application Requirements */}
          <div className="border-b-4 border-[var(--up-gold)] bg-[var(--up-maroon)] px-4 py-20 sm:px-6 lg:px-10">
            <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-14">
              <h2 className="[font-family:var(--font-display)] text-3xl font-bold leading-tight text-white sm:text-4xl">
                Application<br />Requirements
              </h2>
              <ol className="list-decimal space-y-1 pl-5 text-[0.95rem] leading-7 text-[rgba(255,255,255,0.88)] sm:text-[1rem]">
                {appRequirements.map((item: string, i: number) => (
                  <li key={i} className="font-semibold">{item}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Apply button */}
          <div className="flex justify-center gap-4 bg-[var(--page-bg)] px-4 py-12 sm:px-6 lg:px-10">
            {program.program_application?.application_url && (
              <a href={program.program_application.application_url} target="_blank" rel="noopener noreferrer" className="flex-1 max-w-[200px] flex items-center justify-center rounded-sm bg-[var(--up-green)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:bg-[#025c2e]">
                Apply Now
              </a>
            )}
            {program.program_application?.recommendation_url && (
              <a href={program.program_application.recommendation_url} target="_blank" rel="noopener noreferrer" className="flex-1 max-w-[200px] flex items-center justify-center text-center rounded-sm bg-[var(--up-green)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:bg-[#025c2e]">
                Recommendation Letter
              </a>
            )}
          </div>
        </>
      )}

      {activeTab === 'faculty' && (
        <section className="border-b-4 border-[var(--up-gold)] bg-white py-14">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
            <h2 className="[font-family:var(--font-display)] mb-8 text-4xl font-bold text-[var(--up-maroon)] md:text-5xl lg:text-[4rem]">
              Faculty
            </h2>
            <div className="flex flex-row flex-wrap">
              {facultyList.length > 0 ? facultyList.map((member: any, i: number) => (
                <div
                  key={member.faculty_id || i}
                  className="flex w-1/2 flex-col border-r border-[var(--line)] px-6 pb-8 pt-2 last:border-r-0 sm:w-1/3 lg:w-1/4"
                >
                  <div className="relative aspect-[3/4] w-full bg-[var(--surface-muted)] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FacultyImage src={getImageUrl(member.photo)} alt={member.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-[var(--up-gold)]" />
                  </div>
                  <div className="pt-4">
                    <span className="inline-block rounded-full bg-[var(--up-maroon)] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                      {member.position || 'Faculty'}
                    </span>
                  </div>
                  <div className="pt-3">
                    {/* OPTION 1: Credentials under Name */}
                    <div className="text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      {member.name}
                    </div>
                    
                    {member.credentials?.length > 0 && (
                      <div className="mt-0.5 text-[0.65rem] font-medium text-[var(--text-primary)] opacity-75">
                        {member.credentials.map((c: any) => c.degree).join(', ')}
                      </div>
                    )}

                    <div className="mt-1.5 text-xs tracking-widest text-[var(--text-secondary)]">
                      {member.email}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-[var(--text-muted)]">No faculty directory available.</div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}