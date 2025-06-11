"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return setError("Email y contraseña obligatorios");
    }
    try {
      const res = await loginUser(form);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en login");

      // Usamos la función del contexto en lugar de localStorage directo
      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      // No hace falta router.push("/") aquí, lo hace login()
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        {[
          { label: "Email", name: "email", type: "email" },
          { label: "Contraseña", name: "password", type: "password" },
        ].map(({ label, name, type }) => (
          <div className="mb-4" key={name}>
            <label className="block mb-1">{label}</label>
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
