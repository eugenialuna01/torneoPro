import React, { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useForm } from "react-hook-form";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register: registerUser } = useAuth();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    setError("");

    const res = await registerUser(
      data.username,
      data.email,
      data.password
    );

    if (res.success) {
      navigate("/");
    } else {
      setError(
        res.message ||
          "Error al registrarse"
      );
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">


        <div className="bg-linear-to-br from-slate-950 via-slate-900 to-red-900 text-white p-10 hidden lg:flex flex-col justify-between">

          <div>


            <p className="text-sm font-bold uppercase text-red-300 mb-3">
              Gestión deportiva
            </p>

            <h1 className="text-5xl font-black leading-tight">
              TorneoPro
            </h1>

            <p className="text-slate-300 mt-5 leading-relaxed">
              Registrate para enterarte todo sobre torneos, equipos, fixtures, resultados y tablas de posiciones desde una plataforma profesional.
            </p>
          </div>


        </div>

        <div className="p-8 sm:p-10">

          <div className="mb-8">
            <p className="text-sm font-bold text-red-700 uppercase mb-2">
              Crear cuenta
            </p>

            <h2 className="text-3xl font-black text-slate-900">
              Registro de usuario
            </h2>

            <p className="text-slate-500 mt-2">
              Ingresá tus datos para acceder al sistema de torneos.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit(submitHandler)}
            noValidate
          >

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nombre de usuario
              </label>

              <input
                type="text"
                placeholder="Ej: Eugenia"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-600"
                {...register("username", {
                  required:
                    "El nombre es obligatorio",
                })}
              />

              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                placeholder="ejemplo@gmail.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-600"
                {...register("email", {
                  required:
                    "El email es obligatorio",
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
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Contraseña
              </label>

              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-600"
                {...register("password", {
                  required:
                    "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message:
                      "Mínimo 6 caracteres",
                  },
                })}
              />

              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              Crear cuenta
            </button>

          </form>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-sm text-slate-500 hover:text-red-700 font-semibold"
            >
              ¿Ya tenés una cuenta? Iniciar sesión
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Register;