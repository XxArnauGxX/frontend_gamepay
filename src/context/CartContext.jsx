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
import { useNotifications } from "@/components/Notifications";

export const CartContext = createContext();

const initialState = { items: [], loading: true };

function reducer(state, action) {
  const items = Array.isArray(state.items) ? state.items : [];

  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: Array.isArray(action.payload) ? action.payload : [],
        loading: false,
      };

    case "ADD_ITEM": {
      const exists = items.find(
        (i) => i.productId === action.payload.productId
      );
      if (exists) {
        return {
          ...state,
          items: items.map((i) =>
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
            {
              ...action.payload,
              quantity: 1,
              selected: true,
            },
          ],
        };
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: items.filter((i) => i.productId !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "TOGGLE_ITEM":
      return {
        ...state,
        items: items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, selected: action.payload.selected }
            : i
        ),
      };

    case "CLEAR_SELECTED":
      return {
        ...state,
        items: items.filter((i) => !i.selected),
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { accessToken } = useContext(AuthContext);
  const { addNotification } = useNotifications();
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
        const transformedItems = data.map((item) => ({
          productId: item.productId._id,
          name: item.productId.title,
          price: item.productId.price,
          image: item.productId.image,
          quantity: item.quantity,
          selected: item.selected,
        }));
        dispatch({ type: "SET_CART", payload: transformedItems });
      } catch (e) {
        console.error("Error cargando carrito:", e);
        addNotification("Error al cargar el carrito", "error");
      }
    }
    load();
  }, [accessToken, addNotification]);

  const addItem = async (productId, product) => {
    try {
      await addToCart(productId);
      dispatch({
        type: "ADD_ITEM",
        payload: {
          productId,
          name: product.title,
          price: product.price,
          image: product.image,
        },
      });
      addNotification("Producto añadido al carrito", "success");
    } catch (error) {
      addNotification("Error al añadir el producto", "error");
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      dispatch({ type: "REMOVE_ITEM", payload: productId });
      addNotification("Producto eliminado del carrito", "success");
    } catch (error) {
      addNotification("Error al eliminar el producto", "error");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await updateCartItem(productId, quantity);
      if (!res.ok) {
        throw new Error("Error al actualizar la cantidad");
      }
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, quantity },
      });
      addNotification("Cantidad actualizada", "success");
    } catch (error) {
      addNotification("Error al actualizar la cantidad", "error");
      const res = await getCart();
      const data = await res.json();
      dispatch({ type: "SET_CART", payload: data.items });
    }
  };

  const toggleItem = async (productId, selected) => {
    try {
      await toggleCartItem(productId, selected);
      dispatch({
        type: "TOGGLE_ITEM",
        payload: { productId, selected },
      });
    } catch (error) {
      addNotification("Error al actualizar la selección", "error");
    }
  };

  const checkout = async () => {
    try {
      await checkoutCart();
      dispatch({ type: "CLEAR_SELECTED" });
      addNotification("Compra realizada con éxito", "success");
    } catch (error) {
      addNotification("Error al procesar la compra", "error");
    }
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
