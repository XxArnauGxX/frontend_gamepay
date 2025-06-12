"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import { useNotifications } from "@/components/Notifications";

export default function RegisterPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  // Validaciones
  const validators = {
    email: (v) =>
      v.includes("@") || "Debe contener un @",
    password: (v) =>
      (v.length >= 5 && /[a-z]/.test(v) && /[A-Z]/.test(v)) ||
      "Min 5 car., 1 mayús., 1 min.",
    confirmPassword: (v) =>
      v === form.password || "No coincide",
    name: (v) =>
      /^[A-Za-z]+$/.test(v) || "Solo letras",
    surname: (v) =>
      /^[A-Za-z]+$/.test(v) || "Solo letras",
    // address sin validación
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // validación en tiempo real
    if (validators[name]) {
      const valid = validators[name](value);
      setErrors((err) => ({
        ...err,
        [name]: valid === true ? "" : valid,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Revalidar todos
    const newErrors = {};
    for (const key in validators) {
      const valid = validators[key](form[key]);
      if (valid !== true) newErrors[key] = valid;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      const res = await registerUser(form);
      if (!res.ok) {
        const err = await res.json();
        addNotification(err.error || err.errors.join("\n"), "error");
        return;
      }
      addNotification("Registro exitoso. Redirigiendo al login...", "success");
      router.push("/login");
    } catch (err) {
      addNotification("Error al registrar: " + err.message, "error");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl mb-4">Registro</h1>
      <form onSubmit={handleSubmit} noValidate>
        {[
          { label: "Email", name: "email", type: "email" },
          { label: "Contraseña", name: "password", type: "password" },
          {
            label: "Confirmar contraseña",
            name: "confirmPassword",
            type: "password",
          },
          { label: "Nombre", name: "name", type: "text" },
          { label: "Apellidos", name: "surname", type: "text" },
          { label: "Dirección", name: "address", type: "text" },
        ].map(({ label, name, type }) => (
          <div className="mb-4" key={name}>
            <label className="block mb-1">{label}</label>
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}
