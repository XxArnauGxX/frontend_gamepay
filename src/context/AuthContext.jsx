"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { refreshToken as apiRefresh, logoutUser as apiLogout } from "@/lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();

  // Inicial: null (nunca usar localStorage aquí)
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const isLogged = !!accessToken;

  // Al montarse el cliente, leemos localStorage
  useEffect(() => {
    const at = localStorage.getItem("accessToken");
    const rt = localStorage.getItem("refreshToken");
    const email = localStorage.getItem("userEmail");
    if (at && rt && email) {
      setAccessToken(at);
      setRefreshToken(rt);
      setUserEmail(email);
    }
  }, []);

  const saveTokens = (at, rt, email) => {
    setAccessToken(at);
    setRefreshToken(rt);
    setUserEmail(email);
    localStorage.setItem("accessToken", at);
    localStorage.setItem("refreshToken", rt);
    localStorage.setItem("userEmail", email);
  };

  const login = ({ accessToken: at, refreshToken: rt, user }) => {
    saveTokens(at, rt, user.email);
    router.push("/");
  };

  const logout = useCallback(async () => {
    try {
      await apiLogout(refreshToken);
    } catch (e) {
      console.error("Error al hacer logout:", e);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUserEmail(null);
      localStorage.clear();
      router.push("/login");
    }
  }, [refreshToken, router]);

  const refresh = useCallback(async () => {
    if (!refreshToken) return;
    try {
      const res = await apiRefresh(refreshToken);
      const data = await res.json();
      if (res.ok) {
        saveTokens(data.accessToken, data.refreshToken, userEmail);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }, [refreshToken, userEmail, logout]);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, userEmail, isLogged, login, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
