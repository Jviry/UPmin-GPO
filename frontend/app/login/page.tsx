"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* ── Left panel: hero background ── */}
      <div
        className="relative hidden md:flex md:w-[60%] flex-col justify-between bg-cover bg-center bg-no-repeat px-16 py-12"
        style={{ backgroundImage: "url('/hero-section-background.jpg')" }}
      >
        {/* overlays */}
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.55)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(76,9,12,0.35)_0%,rgba(0,0,0,0.65)_100%)]" />

        {/* logo */}
        <div className="relative flex items-center gap-3">
          <Image
            src="/Unibersidad_ng_Pilipinas_Mindanao.png"
            alt="UP Mindanao"
            width={48}
            height={48}
            className="rounded-full"
            style={{ width: 48, height: "auto" }}
          />
          <span className="text-xs uppercase tracking-[0.3em] text-white/70 font-medium">
            UP Mindanao
          </span>
        </div>

        {/* centre text */}
        <div className="relative">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--up-gold)]">
            University of the Philippines Mindanao
          </p>
          <h1
            className="text-6xl leading-[1.05] text-white lg:text-7xl xl:text-8xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Graduate<br />Programs<br />Office
          </h1>
          <div className="mt-6 h-0.5 w-12 bg-[var(--up-gold)]" />
        </div>

        {/* bottom copyright */}
        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} University of the Philippines Mindanao. All rights reserved.
        </p>
      </div>

      {/* ── Right panel: login form ── */}
      <div className="flex w-full md:w-[40%] flex-col items-center justify-center bg-[var(--page-bg)] px-8 py-12 sm:px-16">

        {/* mobile logo — only visible on small screens */}
        <div className="mb-8 flex items-center gap-3 md:hidden">
          <Image
            src="/Unibersidad_ng_Pilipinas_Mindanao.png"
            alt="UP Mindanao"
            width={40}
            height={40}
            className="rounded-full"
            style={{ width: 40, height: "auto" }}
          />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Graduate Programs Office
          </span>
        </div>

        <div className="w-full max-w-sm">
          {/* heading */}
          <div className="mb-8">
            <p className="mb-1 text-xs uppercase tracking-[0.3em] text-[var(--up-maroon)] font-medium">
              Admin Portal
            </p>
            <h2
              className="text-3xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome back.
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Sign in to access the Graduate Programs Office dashboard.
            </p>
          </div>

          {/* form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--up-maroon)] focus:ring-2 focus:ring-[rgba(118,9,12,0.15)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--up-maroon)] focus:ring-2 focus:ring-[rgba(118,9,12,0.15)]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[var(--up-maroon)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709] focus:outline-none focus:ring-2 focus:ring-[rgba(118,9,12,0.4)]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
            Return to{" "}
            <a href="/" className="font-semibold text-[var(--up-maroon)] hover:underline">
              public site
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}