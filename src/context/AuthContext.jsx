"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { refreshToken as apiRefresh, logoutUser as apiLogout } from "@/lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const isLogged = !!accessToken;

  useEffect(() => {
    const at = localStorage.getItem("accessToken");
    const rt = localStorage.getItem("refreshToken");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    if (at && rt && email) {
      setAccessToken(at);
      setRefreshToken(rt);
      setUserEmail(email);
      setUserName(name);
    }
  }, []);

  const saveTokens = (at, rt, email, name) => {
    setAccessToken(at);
    setRefreshToken(rt);
    setUserEmail(email);
    setUserName(name);
    localStorage.setItem("accessToken", at);
    localStorage.setItem("refreshToken", rt);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
  };

  const login = ({ accessToken: at, refreshToken: rt, user }) => {
    saveTokens(at, rt, user.email, user.name);
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
      setUserName(null);
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
      if (!res.ok) throw new Error(data.message || "Error en login");

      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  }, [refreshToken, userEmail, userName, logout, login]);

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

    const interval = setInterval(checkTokens, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isLogged, refresh, logout]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userEmail,
        userName,
        isLogged,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
