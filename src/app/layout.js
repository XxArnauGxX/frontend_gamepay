import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationsProvider } from "@/components/Notifications";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mi Ecommerce",
  description: "Tienda online de productos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NotificationsProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
            </CartProvider>
          </AuthProvider>
        </NotificationsProvider>
      </body>
    </html>
  );
}
