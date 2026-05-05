"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginAdmin } from "@/services/apiServices";

interface User {
  admin_id: number;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      setToken(storedToken);
      // TODO: Validate token with backend if needed
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginAdmin(email, password);
    const { token } = response;
    
    localStorage.setItem("jwt_token", token);
    setToken(token);
    
    // Decode JWT to get user info (without external library for now)
    // In production, consider using jwt-decode library
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      const payload = JSON.parse(atob(parts[1]));
      setUser({
        admin_id: payload.admin_id,
        role: payload.role,
      });
    } catch (e) {
      console.error("Failed to decode token:", e);
      // Token is valid from backend but decode failed
      // Still consider user authenticated but with minimal info
      setUser({ admin_id: 0, role: "unknown" });
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
