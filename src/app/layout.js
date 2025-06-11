// src/app/layout.js

import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";  // ← Importa aquí

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <CartProvider>    {/* ← Ahora sí está definido */}
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-6">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
