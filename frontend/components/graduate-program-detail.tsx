'use client';

import { useState } from 'react';

type ActiveTab = 'structure' | 'application' | 'faculty';

type GraduateProgramDetailProps = {
  programTitle: string;
};

const structureSections = [
  'Core Courses',
  'Required Courses',
  'Elective Courses',
];

const structureSummary = [
  { category: 'Core Courses', units: 15 },
  { category: 'Required Courses', units: 9 },
  { category: "Elective Courses", units: 9 },
  { category: "Master's Thesis", units: 5 },
  { category: 'Total', units: 38 },
];

const loremIntro = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod facilisis dapibus. Nullam posuere dignissim dapibus. Ut a ex sem. Integer ultrices augue vel blandit imperdiet. Duis mollis consectetur nisi quis ullamcorper. Aenean lacinia leo eget ultrices sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras massa nulla, fermentum sed eleifend sed, consequat vel ipsum. Maecenas maximus, dui a gravida ullamcorper, odio risus suscipit risus, eu dignissim arcu quam id lorem. Duis sapien sem, scelerisque a pretium id, lobortis vitae tellus. Pellentesque accumsan, lacus facilisis laoreet finibus, nunc turpis lacinia dui, ac lacinia ligula nisl quis est. Sed elementum porttitor dui dignissim finibus. Sed et nunc sem.',
  'Praesent et est eget dolor scelerisque sollicitudin. Phasellus ullamcorper, ante nec tempor maximus, tellus enim placerat eros, sed fringilla nibh leo eu eros. Vestibulum nibh mi, elementum a quam nec, rutrum volutpat augue. Nullam vitae egestas mi, id vehicula turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec ac massa velit. Morbi iaculis diam quis elit tristique tristique. Cras congue sollicitudin quam sit amet convallis.',
];

const placeholderCourses = [
  { code: 'CRSE 201', title: 'Placeholder Course Title One',   units: 3 },
  { code: 'CRSE 202', title: 'Placeholder Course Title Two',   units: 3 },
  { code: 'CRSE 203', title: 'Placeholder Course Title Three', units: 3 },
  { code: 'CRSE 204', title: 'Placeholder Course Title Four',  units: 3 },
  { code: 'CRSE 205', title: 'Placeholder Course Title Five',  units: 3 },
  { code: 'CRSE 206', title: 'Placeholder Course Title Six',   units: 3 },
];

function CourseRows() {
  return (
    <div className="w-full overflow-hidden rounded-sm border border-[rgba(118,9,12,0.15)]">
      {placeholderCourses.map((course, index) => (
        <div
          key={course.code}
          className={`flex items-center justify-between gap-4 px-4 py-3 text-sm text-[var(--text-primary)] sm:px-6 sm:text-[0.95rem] ${
            index % 2 === 0 ? 'bg-[rgba(118,9,12,0.07)]' : 'bg-[rgba(118,9,12,0.13)]'
          }`}
        >
          <span className="w-24 shrink-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--up-maroon)] sm:text-sm">{course.code}</span>
          <span className="flex-1">{course.title}</span>
          <span className="shrink-0 text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">{course.units} Units</span>
        </div>
      ))}
    </div>
  );
}

function StructureSummaryRows() {
  return (
    <div className="w-full overflow-hidden rounded-sm border border-[rgba(1,68,33,0.25)]">
      {structureSummary.map((row, index) => (
        <div
          key={row.category}
          className={`flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 ${
            index % 2 === 0 ? 'bg-[rgba(1,68,33,0.12)]' : 'bg-[rgba(1,68,33,0.20)]'
          } ${index < structureSummary.length - 1 ? 'border-b border-[rgba(1,68,33,0.25)]' : ''}`}
        >
          <span className="text-sm leading-tight text-[var(--text-primary)] sm:text-[0.95rem]">{row.category}</span>
          <span className="shrink-0 text-sm font-medium uppercase leading-tight text-[var(--text-primary)] sm:text-[0.95rem]">
            {row.units} Units
          </span>
        </div>
      ))}
    </div>
  );
}

const placeholderList10 = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Nunc euismod facilisis dapibus.',
  'Nullam posuere dignissim dapibus.',
  'Ut a ex sem. Integer ultrices augue vel blandit imperdiet.',
  'Duis mollis consectetur nisi quis ullamcorper.',
  'Aenean lacinia leo eget ultrices sagittis.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras massa nulla, fermentum sed eleifend sed, consequat vel ipsum.',
  'Maecenas maximus, dui a gravida ullamcorper, odio risus suscipit risus, eu dignissim arcu quam id lorem.',
  'Duis sapien sem, scelerisque a pretium id, lobortis vitae tellus.',
];

const placeholderList12 = [
  ...placeholderList10,
  'Pellentesque accumsan, lacus facilisis laoreet finibus, nunc turpis lacinia dui, ac lacinia ligula nisl quis est.',
  'Sed elementum porttitor dui dignissim finibus. Sed et nunc sem.',
];

export function GraduateProgramDetail({ programTitle }: GraduateProgramDetailProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('structure');

  return (
    <>
      <section id="introduction" className="border-b-4 border-[var(--up-gold)] bg-[var(--up-maroon)] px-4 pb-20 pt-16 text-white sm:px-6 lg:px-10 lg:pt-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <h1 className="max-w-[14ch] font-[var(--font-display)] text-[2.75rem] leading-[0.94] sm:text-[3.6rem] lg:text-[4.35rem]">
            {programTitle}
          </h1>

          <div className="mt-8 max-w-[1120px] space-y-6 text-[0.96rem] font-normal leading-8 text-[rgba(255,255,255,0.94)] sm:text-[1rem] sm:leading-8 lg:mt-10 lg:text-[1.08rem] lg:leading-9">
            {loremIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
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
                className={`rounded px-2 py-2 transition-colors duration-200 ${
                  activeTab === tab
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
            {/* Row 1: header */}
            <h2 className="[font-family:var(--font-display)] text-4xl font-bold text-[var(--text-primary)] md:text-5xl lg:text-[4rem]">
              Program Structure
            </h2>

            {/* Row 2: instructions */}
            <p className="text-[0.95rem] leading-7 text-[var(--text-secondary)] sm:text-[1rem]">
              To obtain the degree, the student must complete [X] units (including [X] units of [thesis/dissertation]), a refereed publication and where relevant to the thesis, proof of language proficiency.
            </p>

            {/* Row 3: summary table */}
            <StructureSummaryRows />
          </div>

          <hr className="mt-10 border-[var(--line-strong)]" />

          <div className="mt-12 space-y-12">
            {structureSections.map((section) => (
              <div key={section} className="grid items-start gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-10">
                <h3 className="[font-family:var(--font-display)] text-[2.2rem] font-bold leading-tight text-[var(--text-primary)] sm:text-[2.6rem]">
                  {section}
                </h3>
                <CourseRows />
              </div>
            ))}
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
            {[
              { label: 'Full Time', semesters: ['1st Semester', '2nd Semester', 'Summer', '1st Semester', '2nd Semester', 'Summer'] },
              { label: 'Part Time',  semesters: ['1st Semester', '2nd Semester', 'Summer', '1st Semester', '2nd Semester', 'Summer', '1st Semester', '2nd Semester'] },
            ].map((plan) => (
              <div key={plan.label} className="overflow-hidden rounded-sm border border-[rgba(118,9,12,0.15)] bg-white shadow-[0_16px_28px_rgba(0,0,0,0.22)]">
                <div className="border-b border-[rgba(118,9,12,0.15)] bg-[rgba(118,9,12,0.18)] px-5 py-3.5">
                  <p className="[font-family:var(--font-display)] text-lg font-bold text-[var(--up-maroon)]">{plan.label}</p>
                </div>
                {Array.from({ length: 8 }).map((_, i) => {
                  const sem = plan.semesters[i];

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between gap-4 px-5 py-3 ${
                        i % 2 === 0 ? 'bg-[rgba(118,9,12,0.07)]' : 'bg-[rgba(118,9,12,0.13)]'
                      }`}
                    >
                      {sem ? (
                        <>
                          <span className="text-xs uppercase tracking-widest text-[var(--text-primary)]">Year {Math.floor(i / 2) + 1} - {sem}</span>
                          <span className="shrink-0 text-xs font-medium text-[var(--text-muted)]">[X] units</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs uppercase tracking-widest text-transparent select-none">Year 0 - Placeholder</span>
                          <span className="shrink-0 text-xs font-medium text-transparent select-none">[X] units</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
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
            <p className="text-[0.95rem] leading-7 text-[rgba(255,255,255,0.88)] sm:text-[1rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod facilisis dapibus. Nullam posuere dignissim dapibus. Ut a ex sem. Integer ultrices augue vel blandit imperdiet. Duis mollis consectetur nisi quis ullamcorper. Aenean lacinia leo eget ultrices sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras massa nulla, fermentum sed eleifend sed, consequat vel ipsum. Maecenas maximus, dui a gravida ullamcorper, odio risus suscipit risus, eu dignissim arcu quam id lorem. Duis sapien sem, scelerisque a pretium id, lobortis vitae tellus. Pellentesque accumsan, lacus facilisis laoreet finibus, nunc turpis lacinia dui, ac lacinia ligula nisl quis est. Sed elementum porttitor dui dignissim finibus. Sed et nunc sem.
            </p>
          </div>
        </div>

        <div className="h-16 bg-[var(--page-bg)]" />

        {/* Instructions for Applicants + Application Requirements + Apply button */}
        {/* Instructions for Applicants */}
        <div className="bg-[var(--up-maroon)] px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-14">
            <h2 className="[font-family:var(--font-display)] text-3xl font-bold leading-tight text-white sm:text-4xl">
              Instructions<br />for Applicants
            </h2>
            <ol className="list-decimal space-y-1 pl-5 text-[0.95rem] leading-7 text-[rgba(255,255,255,0.88)] sm:text-[1rem]">
              {placeholderList10.map((item, i) => (
                <li key={i} className="font-semibold">{item}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="h-16 bg-[var(--page-bg)]" />

        {/* Application Requirements */}
        <div className="border-b-4 border-[var(--up-gold)] bg-[var(--up-maroon)] px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-14">
            <h2 className="[font-family:var(--font-display)] text-3xl font-bold leading-tight text-white sm:text-4xl">
              Application<br />Requirements
            </h2>
            <ol className="list-decimal space-y-1 pl-5 text-[0.95rem] leading-7 text-[rgba(255,255,255,0.88)] sm:text-[1rem]">
              {placeholderList12.map((item, i) => (
                <li key={i} className="font-semibold">{item}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Apply button */}
        <div className="flex justify-center bg-[var(--page-bg)] px-4 py-12 sm:px-6 lg:px-10">
          <button className="rounded-sm bg-[var(--up-green)] px-10 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:bg-[#025c2e]">
            Apply Now
          </button>
        </div>
        </>
      )}

      {activeTab === 'faculty' && (
        <div className="flex min-h-[40vh] items-center justify-center border-b-4 border-[var(--up-gold)] px-4 py-20 sm:px-6 lg:px-10">
          <p className="text-[var(--text-muted)]">[Faculty section coming soon]</p>
        </div>
      )}
    </>
  );
}
