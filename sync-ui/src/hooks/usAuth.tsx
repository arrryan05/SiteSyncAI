// File: src/hooks/useAuth.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { API_ROUTES } from "../config/index";


interface AuthContextType {
  token: string | null;
  login: (creds: { email: string; password: string }) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // On mount, read from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  // login handler
  const login = async (creds: { email: string; password: string }) => {
    const res = await fetch(API_ROUTES.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
      credentials: 'include'
    });
    if (!res.ok) return false;
    const { token: newToken } = await res.json();
    localStorage.setItem("token", newToken);
    setToken(newToken);
    return true;
  };

  // signup handler
  const signup = async (data: { name: string; email: string; password: string }) => {
    const res = await fetch(API_ROUTES.SIGNUP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return false;
    const { token: newToken } = await res.json();
    localStorage.setItem("token", newToken);
    setToken(newToken);
    return true;
  };

  // logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
