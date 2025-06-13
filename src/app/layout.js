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
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full`}>
        <NotificationsProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col h-full">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
            </CartProvider>
          </AuthProvider>
        </NotificationsProvider>
      </body>
    </html>
  );
}
