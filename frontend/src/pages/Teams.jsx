import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTeams } from "../context/TeamContext";
import { useTournaments } from "../context/TournamentContext";
import { can } from "../utils/permissions";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
const MySwal =withReactContent(Swal);
const Teams = () => {
  const {teams,loading,addTeam,editTeam,removeTeam,} = useTeams();
  const { user } = useAuth();
  const { tournaments } = useTournaments();

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const {register, handleSubmit, reset, setValue,
 formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      coachName: "",
      tournament: "",
    },
  });

  const submitHandler = async (data) => {
    setError("");

    try {
      if (editingId) {
        await editTeam(editingId, data);
           toast.success(
  "Equipo editado correctamente"
);
      } else {
        await addTeam(data);
           toast.success(
  "Equipo creado correctamente"
);
  
      }

      reset({
        name: "",
        coachName: "",
        tournament: "",
      });

      setEditingId(null);
  
    } catch {
      setError("Error al guardar el equipo");
    }
  };

  const handleEdit = (team) => {
    setEditingId(team._id);

    setValue("name", team.name || "");
    setValue("coachName", team.coachName || "");
    setValue(
      "tournament",
      team.tournament?._id || team.tournament || ""
    );
  };

  const handleCancel = () => {
    setEditingId(null);
  
    reset({
      name: "",
      coachName: "",
      tournament: "",
    });
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
  title: "¿Eliminar equipo?",
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

    await removeTeam(id);
     toast.success(
    "Equipo eliminado correctamente"
  );
  };

  return (
    <section className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
              Gestión deportiva
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Equipos
            </h1>

          </div>

          <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl font-semibold">
            {teams.length} equipos
          </div>
        </div>
     {can(user, "team:create") && (
        <form
          onSubmit={handleSubmit(submitHandler)}
          noValidate
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            {editingId ? "Editar equipo" : "Nuevo equipo"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nombre del equipo
              </label>

              <input
                type="text"
                placeholder="Ej: Los Tigres"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("name", {
                  required: "El nombre del equipo es obligatorio",
                })}
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Entrenador
              </label>

              <input
                type="text"
                placeholder="Nombre del entrenador"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("coachName", {
                  required: "El entrenador es obligatorio",
                })}
              />

              {errors.coachName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coachName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Torneo
              </label>

              <select
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("tournament", {
                  required: "Debes seleccionar un torneo",
                })}
              >
                <option value="">Seleccionar torneo</option>

                {tournaments.map((tournament) => (
                  <option
                    key={tournament._id}
                    value={tournament._id}
                  >
                    {tournament.name}
                  </option>
                ))}
              </select>

              {errors.tournament && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tournament.message}
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
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              {editingId ? "Guardar cambios" : "Crear equipo"}
            </button>

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
              Listado de equipos
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-slate-500">
              Cargando equipos...
            </p>
          ) : teams.length === 0 ? (
            <p className="p-6 text-slate-500">
              Todavía no hay equipos cargados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Equipo</th>
                    <th className="px-6 py-4">Entrenador</th>
                    <th className="px-6 py-4">Torneo</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {teams.map((team) => (
                    <tr key={team._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {team.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {team.coachName}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {team.tournament?.name || "Sin torneo"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                         {can(user, "team:update") && (
                          <button
                            onClick={() => handleEdit(team)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg font-semibold transition"
                          >
                            Editar
                          </button>
                          )}
                          {can(user, "team:delete") && (
                          <button
                            onClick={() => handleDelete(team._id)}
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

export default Teams;