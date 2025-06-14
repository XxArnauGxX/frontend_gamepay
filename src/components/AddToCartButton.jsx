"use client";

import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import { memo } from "react";

function AddToCartButtonComponent({ product }) {
  const router = useRouter();
  const { addItem } = useContext(CartContext);
  const { isLogged } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleAdd = useCallback(async () => {
    if (!isLogged) {
      return router.push("/login");
    }
    setLoading(true);
    try {
      await addItem(product._id, product);
    } finally {
      setLoading(false);
    }
  }, [addItem, product, isLogged, router]);

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
