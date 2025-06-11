"use client";

import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    loading,
    removeItem,
    updateQuantity,
    toggleItem,
    checkout,
  } = useContext(CartContext);

  if (loading) return <p>Cargando carrito…</p>;
  if (items.length === 0) return <p>Tu carrito está vacío.</p>;

  const total = items
    .filter(i => i.selected)
    .reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Tu carrito</h1>
      <ul>
        {items.map(item => (
          <li key={item.productId} className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={e => toggleItem(item.productId, e.target.checked)}
              className="mr-2"
            />
            <span className="flex-1">
              {item.name} — {item.price}€ ×{" "}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e =>
                  updateQuantity(item.productId, Number(e.target.value))
                }
                className="w-16 border rounded px-2"
              />
            </span>
            <button
              onClick={() => removeItem(item.productId)}
              className="ml-4 text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
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
