"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Redirect to dashboard if already logged in with a valid token
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setLoading(true);

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";

      if (errorMessage.includes("Invalid Email")) {
        setEmailError("This email isn't registered");
      } else if (errorMessage.includes("Invalid Password")) {
        setEmailError("Incorrect email or password");
      } else {
        setError(errorMessage);
      }
      setLoading(false);
    }
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
          <form className="space-y-3" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="Enter your email"
                required
                disabled={loading}
                suppressHydrationWarning
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition disabled:bg-gray-100 disabled:text-gray-500 ${
                  emailError
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-[var(--line-strong)] focus:border-[var(--up-maroon)] focus:ring-2 focus:ring-[rgba(118,9,12,0.15)]"
                }`}
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 py-3 pr-12 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--up-maroon)] focus:ring-2 focus:ring-[rgba(118,9,12,0.15)] disabled:bg-gray-100 disabled:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--up-maroon)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709] focus:outline-none focus:ring-2 focus:ring-[rgba(118,9,12,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--up-maroon)]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            </div>
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