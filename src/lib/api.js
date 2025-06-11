// src/lib/api.js
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// — Usuarios —

// Registro de usuario
export function registerUser(data) {
  return fetch(`${BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Login de usuario
export function loginUser(creds) {
  return fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });
}

// Refresh de tokens
export function refreshToken() {
  return fetch(`${BASE}/users/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  });
}

// Logout de usuario
export function logoutUser() {
  return fetch(`${BASE}/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  });
}

// — Productos —

// Listar primeros 10 productos
export function listFirstTenProducts() {
  return fetch(`${BASE}/products`);
}

// Buscar productos por nombre
export function searchProducts(name) {
  return fetch(`${BASE}/products/search?name=${encodeURIComponent(name)}`);
}

// Obtener detalle de un producto
export function getProductById(id) {
  return fetch(`${BASE}/products/${id}`);
}

// — Carrito —

// Obtener carrito del usuario
export function getCart() {
  return fetch(`${BASE}/cart`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

// Añadir producto al carrito
export function addToCart(productId) {
  return fetch(`${BASE}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({ productId }),
  });
}

// Más adelante: removeFromCart, updateCartItem, toggleSelectItem, checkoutCart…
