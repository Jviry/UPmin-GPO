"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook to protect routes that require authentication
 * Usage: Call this at the top of a component to ensure user is logged in
 * @example
 * export default function AdminDashboard() {
 *   useProtectedRoute();
 *   // ... rest of component
 * }
 */
export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isLoading, isAuthenticated };
}
