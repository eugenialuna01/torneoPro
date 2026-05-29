import React from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await login(
      data.email,
      data.password
    );

    if (response?.success) {
      navigate("/");
    } else {
      MySwal.fire({
        title: "Acceso denegado",
        text:
          response?.message ||
          "Correo o contraseña incorrectos",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
        confirmButtonColor: "#b91c1c",
        background: "#0f172a",
        color: "#ffffff",
        iconColor: "#ef4444",
        customClass: {
          popup: "rounded-xl shadow-2xl",
          title: "text-xl font-bold",
          htmlContainer: "text-sm text-gray-300",
        },
      });
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

    
        <div className="bg-linear-to-br from-slate-950 via-slate-900 to-red-900 text-white p-10 hidden lg:flex flex-col justify-between">

          <div>
           
            <p className="text-sm font-bold uppercase text-red-300 mb-3">
              Plataforma deportiva
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Bienvenido a
              <span className="block text-red-300">
                TorneoPro
              </span>
            </h1>

            <p className="text-slate-300 mt-5 leading-relaxed">
              Iniciá sesión para administrar torneos, equipos, jugadores, fixtures y resultados desde un panel profesional.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10">
         </div>

        </div>

        <div className="p-8 sm:p-10">

          <div className="mb-8">
            <p className="text-sm font-bold text-red-700 uppercase mb-2">
              Acceso al sistema
            </p>

            <h2 className="text-3xl font-black text-slate-900">
              Iniciar sesión
            </h2>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >

            <div>
              <label
                className="block text-sm font-semibold text-slate-700 mb-1"
                htmlFor="email"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                placeholder="ejemplo@gmail.com"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-600 ${
                  errors.email
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
                {...register("email", {
                  required:
                    "El correo es obligatorio",
                  pattern: {
                    value:
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      "Ingresa un email válido",
                  },
                })}
              />

              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-semibold text-slate-700 mb-1"
                htmlFor="password"
              >
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-600 ${
                  errors.password
                    ? "border-red-500"
                    : "border-slate-300"
                }`}
                {...register("password", {
                  required:
                    "La contraseña es obligatoria",
                })}
              />

              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              Iniciar sesión
            </button>

          </form>

          <div className="text-center mt-6">
            <Link
              to="/register"
              className="text-sm text-slate-500 hover:text-red-700 font-semibold"
            >
              ¿No tenés una cuenta? Registrate
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Login;