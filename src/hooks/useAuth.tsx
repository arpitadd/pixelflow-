"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { IUser } from "@/types";
import { API_ROUTES, ROUTES } from "@/constants";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await fetch(API_ROUTES.ME);
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(API_ROUTES.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        window.location.href = ROUTES.FEED;
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const signup = async (formData: { name: string; username: string; email: string; password: string }) => {
    try {
      const res = await fetch(API_ROUTES.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        window.location.href = ROUTES.FEED;
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    await fetch(API_ROUTES.LOGOUT, { method: "POST" });
    setUser(null);
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
