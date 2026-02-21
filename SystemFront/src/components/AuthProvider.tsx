"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { dummyData } from "@/data/dummyData";
import type { UserRole } from "@/data/dummyData";

export type User = { id: string; name: string; role: UserRole };

const STORAGE_KEY = "mes-user";

interface AuthContextValue {
  user: User | null;
  login: (id: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as User;
    const account = dummyData.accounts.find((a) => a.id === data.id);
    if (!account) return null;
    return { id: account.id, name: account.name, role: account.role };
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    setUser(loadStoredUser());
  }, []);

  const login = useCallback((id: string, _password: string): { ok: boolean; error?: string } => {
    const account =
      dummyData.accounts.find((a) => a.id === id.trim() && a.password === _password) ??
      dummyData.accounts[0];
    const u = { id: account.id, name: account.name, role: account.role };
    setUser(u);
    saveUser(u);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveUser(null);
  }, []);

  const value: AuthContextValue = { user, login, logout, isReady };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
