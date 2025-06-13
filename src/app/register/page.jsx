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

  const validators = {
    email: (v) => v.includes("@") || "Debe contener un @",
    password: (v) =>
      (v.length >= 5 && /[a-z]/.test(v) && /[A-Z]/.test(v)) ||
      "Min 5 car., 1 mayús., 1 min.",
    confirmPassword: (v) => v === form.password || "No coincide",
    name: (v) => /^[A-Za-z]+$/.test(v) || "Solo letras",
    surname: (v) => /^[A-Za-z]+$/.test(v) || "Solo letras",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

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
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Crear cuenta
            </h1>
            <p className="text-gray-600">Únete a nuestra comunidad</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {[
              {
                label: "Email",
                name: "email",
                type: "email",
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                placeholder: "ejemplo@correo.com",
              },
              {
                label: "Contraseña",
                name: "password",
                type: "password",
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                placeholder: "Mínimo 5 caracteres",
              },
              {
                label: "Confirmar contraseña",
                name: "confirmPassword",
                type: "password",
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                placeholder: "Repite tu contraseña",
              },
              {
                label: "Nombre",
                name: "name",
                type: "text",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                placeholder: "Tu nombre",
              },
              {
                label: "Apellidos",
                name: "surname",
                type: "text",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                placeholder: "Tus apellidos",
              },
              {
                label: "Dirección",
                name: "address",
                type: "text",
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                placeholder: "Tu dirección completa",
              },
            ].map(({ label, name, type, icon, placeholder }) => (
              <div key={name} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={icon}
                      />
                    </svg>
                  </div>
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={placeholder}
                  />
                </div>
                {errors[name] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Crear cuenta
            </button>
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
