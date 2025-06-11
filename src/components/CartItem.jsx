// src/components/CartItem.jsx
"use client";

import { memo, useCallback } from "react";

function CartItemComponent({
  item,
  removeItem,
  updateQuantity,
  toggleItem,
}) {
  const { productId, name, price, quantity, selected } = item;

  const onRemove = useCallback(() => {
    removeItem(productId);
  }, [removeItem, productId]);

  const onToggle = useCallback(
    (e) => {
      toggleItem(productId, e.target.checked);
    },
    [toggleItem, productId]
  );

  const onQuantityChange = useCallback(
    (e) => {
      const q = Number(e.target.value) || 1;
      updateQuantity(productId, q);
    },
    [updateQuantity, productId]
  );

  return (
    <li className="flex items-center mb-4">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="mr-2"
      />
      <span className="flex-1">
        {name} — {price.toFixed(2)}€ ×{" "}
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={onQuantityChange}
          className="w-16 border rounded px-2"
        />
      </span>
      <button
        onClick={onRemove}
        className="ml-4 text-red-600 hover:underline"
      >
        Eliminar
      </button>
    </li>
  );
}

export default memo(CartItemComponent);
