"use client";

import { memo, useCallback } from "react";

function CartItemComponent({ item, removeItem, updateQuantity, toggleItem }) {
  const {
    productId,
    name = "–",
    price = 0,
    quantity = 1,
    selected = false,
  } = item;

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
    <li className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
          />
        </div>

        <div className="flex-shrink-0">
          <img
            src={item.image || "/placeholder.png"}
            alt={name}
            className="h-20 w-20 object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-lg font-medium text-gray-900 truncate">{name}</p>
          <p className="text-sm text-gray-500">{price.toFixed(2)}€</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={onQuantityChange}
              className="w-16 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            />
          </div>

          <button
            onClick={onRemove}
            className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
export default memo(CartItemComponent);
