"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { refreshToken as apiRefresh, logoutUser } from "@/lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshTokenState] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Al montar, cargamos de localStorage
  useEffect(() => {
    const at = localStorage.getItem("accessToken");
    const rt = localStorage.getItem("refreshToken");
    const email = localStorage.getItem("userEmail");
    if (at && rt) {
      setAccessToken(at);
      setRefreshTokenState(rt);
      setUserEmail(email);
    }
  }, []);

  // Guardar tokens en estado y localStorage
  const saveTokens = (at, rt, email) => {
    setAccessToken(at);
    setRefreshTokenState(rt);
    setUserEmail(email);
    localStorage.setItem("accessToken", at);
    localStorage.setItem("refreshToken", rt);
    localStorage.setItem("userEmail", email);
  };

  // Función de login: recibe { accessToken, refreshToken, user: { email } }
  const login = ({ accessToken: at, refreshToken: rt, user }) => {
    saveTokens(at, rt, user.email);
    router.push("/");
  };

  // Función de logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Error al hacer logout:", e);
    } finally {
      setAccessToken(null);
      setRefreshTokenState(null);
      setUserEmail(null);
      localStorage.clear();
      router.push("/login");
    }
  };

  // Función para refrescar tokens
  const refresh = useCallback(async () => {
    if (!refreshToken) return;
    try {
      const res = await apiRefresh();
      const data = await res.json();
      if (res.ok) {
        saveTokens(data.accessToken, data.refreshToken, userEmail);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }, [refreshToken, userEmail]);

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
