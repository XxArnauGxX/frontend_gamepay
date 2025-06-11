// src/components/Navbar.jsx
"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { isLogged, userEmail, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Home */}
        <Link href="/" className="text-xl font-bold">
          MiEcommerce
        </Link>

        {/* Enlaces */}
        <div className="space-x-4 flex items-center">
          {!isLogged ? (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700">Hola, {userEmail}</span>
              <button onClick={logout} className="hover:underline text-red-600">
                Logout
              </button>
            </>
          )}

          {/* Carrito */}
          <Link href="/cart" className="relative hover:underline">
            🛒
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
