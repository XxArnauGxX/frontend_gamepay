"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listFirstTenProducts, searchProducts } from "@/lib/api";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await listFirstTenProducts();
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!query.trim()) {
      const res = await listFirstTenProducts();
      const data = await res.json();
      setProducts(data);
    } else {
      const res = await searchProducts(query);
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a ShopHub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu destino de compras online. Encuentra los mejores productos para
            tu hogar, tecnología, moda y más.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="flex shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-6 py-4 text-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition duration-150 ease-in-out flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Buscar
            </button>
          </div>
        </form>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No se encontraron productos
            </h3>
            <p className="mt-1 text-gray-500">Intenta con otra búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p) => (
              <Link href={`/product/${p._id}`} key={p._id}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {p.price.toFixed(2)}€
                    </div>
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {p.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-gray-600">
                          {p.rating.rate}
                        </span>
                        <span className="ml-1 text-gray-400">
                          ({p.rating.count})
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Ver detalles →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
