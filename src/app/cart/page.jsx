"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import CartItem from "@/components/CartItem";

export default function CartPage() {
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const { items, loading, removeItem, updateQuantity, toggleItem, checkout } =
    useContext(CartContext);

  useEffect(() => {
    if (!isLogged) router.push("/login");
  }, [isLogged, router]);

  if (!isLogged) return null;
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  if (!items.length)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
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
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 text-gray-600">
            ¡Añade algunos productos para empezar a comprar!
          </p>
        </div>
      </div>
    );

  const total = items
    .filter((i) => i.selected)
    .reduce(
      (sum, i) =>
        sum + (i.quantity || 0) * (typeof i.price === "number" ? i.price : 0),
      0
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Tu carrito</h1>
            <p className="mt-2 text-sm text-gray-600">
              Revisa tus productos seleccionados
            </p>
          </div>

          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
                toggleItem={toggleItem}
              />
            ))}
          </ul>

          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total seleccionado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {total.toFixed(2)}€
                </p>
              </div>
              <button
                onClick={checkout}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Confirmar compra
                <svg
                  className="ml-2 -mr-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
