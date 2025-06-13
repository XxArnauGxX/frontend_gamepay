"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";

export default function Navbar() {
  const { isLogged, userName, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext) || { items: [] };

  const totalCount = Array.isArray(items)
    ? items.reduce((sum, i) => sum + (i.quantity || 0), 0)
    : 0;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Home */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          ShopHub
        </Link>

        {/* Enlaces y carrito */}
        <div className="space-x-6 flex items-center">
          {!isLogged ? (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700 font-medium">
                Hola, {userName}
              </span>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                Cerrar sesión
              </button>
            </>
          )}

          {/* Carrito */}
          <Link href="/cart" className="relative group">
            <div className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
