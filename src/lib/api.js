const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function fetchWithAuth(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

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
      localStorage.clear();
      window.location.href = "/login";
      throw error;
    }
  }

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      try {
        const newAccessToken = await refreshTokens();
        headers.Authorization = `Bearer ${newAccessToken}`;
        return fetch(url, { ...options, headers });
      } catch (error) {
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

export function registerUser(data) {
  return fetch(`${BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function loginUser(creds) {
  return fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });
}

export function refreshToken(rt) {
  return fetch(`${BASE}/users/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-refresh-token": rt,
    },
  });
}

export function logoutUser(rt) {
  return fetch(`${BASE}/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-refresh-token": rt,
    },
  });
}

export function listFirstTenProducts() {
  return fetch(`${BASE}/products`);
}

export function searchProducts(name) {
  return fetch(`${BASE}/products/search?name=${encodeURIComponent(name)}`);
}

export function getProductById(id) {
  return fetch(`${BASE}/products/${id}`);
}

export function getCart() {
  return fetchWithAuth(`${BASE}/cart`);
}

export function addToCart(productId) {
  return fetchWithAuth(`${BASE}/cart`, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export function removeFromCart(productId) {
  return fetchWithAuth(`${BASE}/cart/${productId}`, {
    method: "DELETE",
  });
}

export function updateCartItem(productId, quantity) {
  return fetchWithAuth(`${BASE}/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function toggleCartItem(productId, selected) {
  return fetchWithAuth(`${BASE}/cart/${productId}/select`, {
    method: "PATCH",
    body: JSON.stringify({ selected }),
  });
}

export function checkoutCart() {
  return fetchWithAuth(`${BASE}/cart/checkout`, {
    method: "POST",
  });
}
