import { useState } from "react";
import { useForm } from "react-hook-form";

import { usePlayers } from "../context/PlayerContext";
import { useTeams } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import { can } from "../utils/permissions";
import { toast } from "react-toastify";

const Players = () => {
  const { user } = useAuth();

  const {
    players,
    loading,
    addPlayer,
    editPlayer,
    removePlayer,
  } = usePlayers();

  const { teams } = useTeams();

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      dni: "",
      age: "",
      position: "",
      team: "",
    },
  });

  const submitHandler = async (data) => {
    setError("");

    try {
      const payload = {
        ...data,
        age: Number(data.age),
      };

      if (editingId) {
        await editPlayer(editingId, payload);
         toast.success(
  "Jugador editado correctamente"
);
      } else {
        await addPlayer(payload);
         toast.success(
  "Jugador creado correctamente"
);
      }

      reset({
        fullName: "",
        dni: "",
        age: "",
        position: "",
        team: "",
      });

      setEditingId(null);
    } catch {
      setError("Error al guardar jugador");
    }
  };

  const handleEdit = (player) => {
    setEditingId(player._id);

    setValue("fullName", player.fullName || "");
    setValue("dni", player.dni || "");
    setValue("age", player.age || "");
    setValue("position", player.position || "");
    setValue("team", player.team?._id || player.team || "");
  };

  const handleCancel = () => {
    setEditingId(null);

    reset({
      fullName: "",
      dni: "",
      age: "",
      position: "",
      team: "",
    });
  };

  const handleDelete = async (id) => {
   const result = await MySwal.fire({
  title: "¿Eliminar jugador?",
  text: "Esta acción no se puede deshacer",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#dc2626",
  cancelButtonColor: "#475569",
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
  background: "#0f172a",
  color: "#ffffff",
  iconColor: "#f59e0b",
  customClass: {
    popup: "rounded-2xl shadow-2xl",
    title: "text-2xl font-bold",
    htmlContainer: "text-slate-300",
    confirmButton:
      "px-5 py-2 rounded-xl font-semibold",
    cancelButton:
      "px-5 py-2 rounded-xl font-semibold",
  },
});

if (!result.isConfirmed) return;

    await removePlayer(id);
     toast.success(
  "Jugador eliminado correctamente"
);
  };

  if (!can(user, "player:read")) {
    return (
      <section className="p-6">
        <p className="text-red-600 font-semibold">
          No tienes permiso para ver jugadores.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg p-8 text-white">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-semibold mb-4">
            Planteles
          </span>

          <h1 className="text-4xl font-bold">
            Jugadores
          </h1>

          <p className="text-slate-300 mt-3">
            Registrá tus jugadores.
          </p>
        </div>

        {(can(user, "player:create") ||
          can(user, "player:update")) && (
          <form
            onSubmit={handleSubmit(submitHandler)}
            noValidate
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              {editingId ? "Editar jugador" : "Nuevo jugador"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nombre completo
                </label>

                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                  {...register("fullName", {
                    required: "El nombre es obligatorio",
                  })}
                />

                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  DNI
                </label>

                <input
                  type="text"
                  placeholder="Ej: 40123456"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                  {...register("dni", {
                    required: "El DNI es obligatorio",
                  })}
                />

                {errors.dni && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dni.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Edad
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 18"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                  {...register("age", {
                    required: "La edad es obligatoria",
                  })}
                />

                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Posición
                </label>

                <select
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                  {...register("position", {
                    required: "La posición es obligatoria",
                  })}
                >
                  <option value="">Seleccionar posición</option>
                  <option value="Arquero">Arquero</option>
                  <option value="Defensor">Defensor</option>
                  <option value="Mediocampista">Mediocampista</option>
                  <option value="Delantero">Delantero</option>
                  <option value="Base">Base</option>
                  <option value="Escolta">Escolta</option>
                  <option value="Zaguero">Zaguero</option>
                  <option value="Alero">Alero</option>
                  <option value="Pivot">Pivot</option>
                  <option value="Universal">Universal</option>
                  <option value="Pilar">Pilar</option>
                  <option value="Hooker">Hooker</option>
                </select>

                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.position.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Equipo
                </label>

                <select
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                  {...register("team", {
                    required: "Debes seleccionar un equipo",
                  })}
                >
                  <option value="">Seleccionar equipo</option>

                  {teams.map((team) => (
                    <option
                      key={team._id}
                      value={team._id}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>

                {errors.team && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.team.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-4">
                {error}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {(!editingId && can(user, "player:create")) ||
              (editingId && can(user, "player:update")) ? (
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  {editingId
                    ? "Guardar cambios"
                    : "Crear jugador"}
                </button>
              ) : null}

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-3 rounded-xl transition"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Listado de jugadores
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-slate-500">
              Cargando jugadores...
            </p>
          ) : players.length === 0 ? (
            <p className="p-6 text-slate-500">
              Todavía no hay jugadores cargados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Jugador</th>
                    <th className="px-6 py-4">DNI</th>
                    <th className="px-6 py-4">Edad</th>
                    <th className="px-6 py-4">Posición</th>
                    <th className="px-6 py-4">Equipo</th>
                    <th className="px-6 py-4">Torneo</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {players.map((player) => (
                    <tr
                      key={player._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {player.fullName}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {player.dni}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {player.age}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {player.position}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {player.team?.name || "Sin equipo"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {player.team?.tournament?.name || "Sin torneo"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {can(user, "player:update") && (
                            <button
                              onClick={() => handleEdit(player)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg font-semibold transition"
                            >
                              Editar
                            </button>
                          )}

                          {can(user, "player:delete") && (
                            <button
                              onClick={() => handleDelete(player._id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-semibold transition"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Players;