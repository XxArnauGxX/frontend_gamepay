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
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
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
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await apiRefresh(refreshToken);
      if (!res.ok) {
        throw new Error("Refresh token invalid");
      }
      const data = await res.json();
      saveTokens(data.accessToken, data.refreshToken, userEmail);
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  }, [refreshToken, userEmail, logout]);

  // Verificar tokens periódicamente
  useEffect(() => {
    if (!isLogged) return;

    const checkTokens = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error("Error checking tokens:", error);
        logout();
      }
    };

    // Verificar cada 4 minutos (los tokens suelen durar 5)
    const interval = setInterval(checkTokens, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isLogged, refresh, logout]);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, userEmail, isLogged, login, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
