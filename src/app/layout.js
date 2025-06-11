import "./globals.css";
import Navbar from "../components/Navbar";
import Providers from "../components/Providers";

export const metadata = {
  title: "Ecommerce UF4",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Navbar />
          <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
