// src/app/cart/page.jsx
"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import CartItem from "@/components/CartItem";

export default function CartPage() {
  const router = useRouter();
  const { isLogged } = useContext(AuthContext);
  const {
    items,
    loading,
    removeItem,
    updateQuantity,
    toggleItem,
    checkout,
  } = useContext(CartContext);

  useEffect(() => {
    if (!isLogged) router.push("/login");
  }, [isLogged, router]);

  if (!isLogged) return null;
  if (loading) return <p>Cargando carrito…</p>;
  if (!items.length) return <p>Tu carrito está vacío.</p>;

  // Garantizar que price y quantity existan
  const total = items
    .filter((i) => i.selected)
    .reduce(
      (sum, i) =>
        sum + (i.quantity || 0) * (typeof i.price === "number" ? i.price : 0),
      0
    );

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Tu carrito</h1>
      <ul>
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
      <div className="mt-6 flex justify-between items-center">
        <span className="text-lg font-semibold">
          Total: {total.toFixed(2)}€
        </span>
        <button
          onClick={checkout}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Confirmar compra
        </button>
      </div>
    </div>
  );
}
