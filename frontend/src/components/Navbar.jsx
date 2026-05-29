import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/95 border-b border-red-900/30 text-white shadow-lg backdrop-blur">

      <nav className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">

        <div className="flex items-center">

          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-red-700 to-red-900 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
              ⚽
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                TorneoPro
              </h1>

              <p className="text-xs text-red-300 uppercase tracking-[3px] font-semibold">
                Gestión deportiva
              </p>
            </div>
          </Link>

        </div>

        <div className="flex justify-center">

          {user ? (
            <div className="hidden lg:flex items-center gap-2 text-sm font-semibold">

              <Link
                to="/"
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                Inicio
              </Link>

              <Link
                to="/torneos"
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                Torneos
              </Link>

              <Link
                to="/equipos"
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                Equipos
              </Link>

              <Link
                to="/partidos"
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                Partidos
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/usuarios"
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
                >
                  Usuarios
                </Link>
              )}
            {(user?.role === "admin" ||
  user?.role === "coach") && (
  <Link
    to="/jugadores"
    className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
  >
    {user?.role === "admin"
      ? "Jugadores"
      : "Mi Equipo"}
  </Link>
)}
              

            </div>
          ) : null}

        </div>

        <div className="flex items-center justify-end gap-4">

          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">

                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-700 to-red-900 flex items-center justify-center text-white font-black shadow-md">
                  {user.username?.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white leading-none">
                    {user.username}
                  </span>

                  <span className="text-xs text-red-300 uppercase tracking-wide font-semibold mt-1">
                    {user.role}
                  </span>
                </div>

              </div>

              <button
                onClick={logout}
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition shadow-lg hover:shadow-red-900/40"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">

              <Link
                to="/api/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition shadow-lg"
              >
                Registrarse
              </Link>

            </div>
          )}

        </div>

      </nav>

    </header>
  );
};

export default Navbar;
