"use client";

import { createContext, useReducer, useEffect, useContext } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  toggleCartItem,
  checkoutCart,
} from "@/lib/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const initialState = { items: [], loading: true };

function reducer(state, action) {
  // Aseguramos que siempre trabajamos con un array
  const items = Array.isArray(state.items) ? state.items : [];

  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: Array.isArray(action.payload) ? action.payload : [],
        loading: false,
      };

    case "ADD_ITEM": {
      const exists = items.find(i => i.productId === action.payload.productId);
      if (exists) {
        return {
          ...state,
          items: items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      } else {
        return {
          ...state,
          items: [
            ...items,
            { ...action.payload, quantity: 1, selected: true },
          ],
        };
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: items.filter(i => i.productId !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "TOGGLE_ITEM":
      return {
        ...state,
        items: items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, selected: action.payload.selected }
            : i
        ),
      };

    case "CLEAR_SELECTED":
      return {
        ...state,
        items: items.filter(i => !i.selected),
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { accessToken } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function load() {
      if (!accessToken) {
        dispatch({ type: "SET_CART", payload: [] });
        return;
      }
      try {
        const res = await getCart();
        const data = await res.json();
        dispatch({ type: "SET_CART", payload: data.items });
      } catch (e) {
        console.error("Error cargando carrito:", e);
      }
    }
    load();
  }, [accessToken]);

  const addItem = async productId => {
    await addToCart(productId);
    dispatch({ type: "ADD_ITEM", payload: { productId } });
  };

  const removeItem = async productId => {
    await removeFromCart(productId);
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = async (productId, quantity) => {
    await updateCartItem(productId, quantity);
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity },
    });
  };

  const toggleItem = async (productId, selected) => {
    await toggleCartItem(productId, selected);
    dispatch({
      type: "TOGGLE_ITEM",
      payload: { productId, selected },
    });
  };

  const checkout = async () => {
    await checkoutCart();
    dispatch({ type: "CLEAR_SELECTED" });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        loading: state.loading,
        addItem,
        removeItem,
        updateQuantity,
        toggleItem,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
