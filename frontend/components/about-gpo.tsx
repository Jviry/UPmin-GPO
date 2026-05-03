import React from "react";
import PlaceholderProfileImg from "@/components/PlaceholderProfileImg";

const programs = [
  "Program Alpha",
  "Program Beta",
  "Program Gamma",
  "Program Delta",
  "Program Epsilon",
  "Program Zeta",
  "Program Eta",
  "Program Theta",
  "Program Iota",
];

const coordinators = programs.map((program) => ({
  name: `Placeholder Name`,
  role: "Position Title",
  program,
  img: "/placeholder-profile.png",
}));

const testimonies = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    name: "Placeholder Name",
    program: "Program Title, Year",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    name: "Placeholder Name",
    program: "Program Title, Year",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    name: "Placeholder Name",
    program: "Program Title, Year",
  },
];

export default function AboutGPO() {
  return (
    <div className="w-full">
      {/* Header + Org Chart */}
      <section className="bg-white border-b-4 border-[var(--up-gold)] pb-0">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <h1 className="text-5xl md:text-6xl leading-tight text-[var(--up-maroon)]" style={{ fontFamily: 'var(--font-display)' }}>
            About the Graduate Program Office
          </h1>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="bg-[var(--up-maroon)] border-t-4 border-[var(--up-gold)] py-12 w-full">
          <div className="max-w-6xl mx-auto px-4 h-96">
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
            {coordinators.map((c, i) => (
              <div
                key={i}
                className="flex flex-col w-1/2 sm:w-1/3 lg:w-1/4 border-r border-[var(--line)] last:border-r-0 px-6 pb-8 pt-2"
              >
                {/* Image area with gold bottom bar only */}
                <div className="relative w-full aspect-[3/4] bg-[var(--surface-muted)]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlaceholderProfileImg className="border-0 rounded-none" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-[var(--up-gold)]" />
                </div>
                {/* Program pill */}
                <div className="pt-4">
                  <span className="inline-block bg-[var(--up-maroon)] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {c.program}
                  </span>
                </div>
                {/* Name and role */}
                <div className="pt-3">
                  <div className="font-bold text-base uppercase tracking-wider text-[var(--text-primary)]">{c.name}</div>
                  <div className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mt-1">{c.role}</div>
                </div>
              </div>
            ))}
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
            {testimonies.map((t, i) => (
              <div key={i} className="py-8 first:pt-0 last:pb-0">
                <div className="text-white/30 text-6xl leading-none mb-2 select-none" style={{ fontFamily: 'var(--font-display)', lineHeight: 1 }}>&ldquo;</div>
                <p className="text-white text-lg leading-relaxed mb-5">"{t.text}"</p>
                <div className="text-[var(--up-gold)] font-bold text-xs uppercase tracking-widest">{t.name}</div>
                <div className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">{t.program}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
