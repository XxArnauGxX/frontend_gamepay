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
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload, loading: false };
    case "ADD_ITEM":
      // igual que antes...
      // …
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case "TOGGLE_ITEM":
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, selected: action.payload.selected }
            : i
        ),
      };
    case "CLEAR_SELECTED":
      return {
        ...state,
        items: state.items.filter(i => !i.selected),
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
      } catch (e) { console.error(e); }
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
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };
  const toggleItem = async (productId, selected) => {
    await toggleCartItem(productId, selected);
    dispatch({ type: "TOGGLE_ITEM", payload: { productId, selected } });
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
