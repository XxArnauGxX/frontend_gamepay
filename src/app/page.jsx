"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listFirstTenProducts, searchProducts } from "@/lib/api";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial de los primeros 10 productos
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

  // Al enviar el formulario de búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!query.trim()) {
      // Si no hay query, recarga los primeros 10
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
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {loading ? (
        <p>Cargando productos…</p>
      ) : products.length === 0 ? (
        <p>No se han encontrado productos.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <li
              key={p._id}
              className="bg-white p-4 rounded shadow hover:shadow-md"
            >
              <Link href={`/product/${p._id}`}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="mt-1 font-medium">{p.price.toFixed(2)}€</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
