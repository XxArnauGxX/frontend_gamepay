// src/components/AddToCartButton.jsx
"use client";

import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import { memo } from "react";

function AddToCartButtonComponent({ productId }) {
  const router = useRouter();
  const { addItem } = useContext(CartContext);
  const { isLogged } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleAdd = useCallback(async () => {
    if (!isLogged) {
      // Redirige al login si no estás autenticado
      return router.push("/login");
    }
    setLoading(true);
    try {
      await addItem(productId);
    } finally {
      setLoading(false);
    }
  }, [addItem, productId, isLogged, router]);

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

export default memo(AddToCartButtonComponent);
