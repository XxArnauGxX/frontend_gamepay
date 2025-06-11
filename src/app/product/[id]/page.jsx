// src/app/product/[id]/page.jsx
import { getProductById } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage(props) {
  // Esperamos a que params esté disponible
  const { params } = await props;
  const { id } = params;

  // Llamamos al backend
  const res = await getProductById(id);
  if (!res.ok) {
    return <p>Error al cargar el producto.</p>;
  }
  const product = await res.json();

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-lg mb-2">Precio: {product.price.toFixed(2)}€</p>
      <p className="mb-4">{product.description}</p>
      {/* Botón client para añadir al carrito */}
      <AddToCartButton productId={product._id} />
    </div>
  );
}
