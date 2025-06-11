// src/context/AuthContext.jsx
"use client";

import { createContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { refreshToken as apiRefresh, logoutUser as apiLogout } from "@/lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();

  // Leemos tokens y email de localStorage en la inicialización
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("refreshToken")
  );
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem("userEmail")
  );

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
      // Llamada corregida a la API (cabecera en apiLogout)
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
      value={{
        accessToken,
        refreshToken,
        userEmail,
        isLogged: !!accessToken,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
