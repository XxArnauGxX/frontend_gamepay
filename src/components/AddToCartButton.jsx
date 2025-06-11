"use client";

import { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function AddToCartButton({ productId }) {
  const { addItem } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await addItem(productId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Añadiendo…" : "Añadir al carrito"}
    </button>
  );
}
