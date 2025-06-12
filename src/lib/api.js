// src/lib/api.js
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Cliente HTTP personalizado
async function fetchWithAuth(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // Función para refrescar el token
  async function refreshTokens() {
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const res = await fetch(`${BASE}/users/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-refresh-token": refreshToken,
        },
      });
      
      if (!res.ok) {
        throw new Error("Refresh token invalid or expired");
      }

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data.accessToken;
    } catch (error) {
      // Limpiar tokens y redirigir al login
      localStorage.clear();
      window.location.href = "/login";
      throw error;
    }
  }

  // Añadir headers de autenticación
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    
    // Si el token ha expirado, intentamos refrescarlo
    if (response.status === 401) {
      try {
        const newAccessToken = await refreshTokens();
        headers.Authorization = `Bearer ${newAccessToken}`;
        return fetch(url, { ...options, headers });
      } catch (error) {
        // Si falla el refresh, redirigimos al login
        window.location.href = "/login";
        throw error;
      }
    }

    return response;
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error;
  }
}

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
export function refreshToken(rt) {
  return fetch(`${BASE}/users/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-refresh-token": rt,
    },
  });
}

// Logout de usuario
export function logoutUser(rt) {
  return fetch(`${BASE}/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-refresh-token": rt,
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
  return fetchWithAuth(`${BASE}/cart`);
}

// Añadir producto al carrito
export function addToCart(productId) {
  return fetchWithAuth(`${BASE}/cart`, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

// Quitar un producto del carrito
export function removeFromCart(productId) {
  return fetchWithAuth(`${BASE}/cart/${productId}`, {
    method: "DELETE",
  });
}

// Actualizar cantidad de un producto en el carrito
export function updateCartItem(productId, quantity) {
  return fetchWithAuth(`${BASE}/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

// Seleccionar/desseleccionar un producto
export function toggleCartItem(productId, selected) {
  return fetchWithAuth(`${BASE}/cart/${productId}/select`, {
    method: "PATCH",
    body: JSON.stringify({ selected }),
  });
}

// Confirmar compra de productos seleccionados
export function checkoutCart() {
  return fetchWithAuth(`${BASE}/cart/checkout`, {
    method: "POST",
  });
}
