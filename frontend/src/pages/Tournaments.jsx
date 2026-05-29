import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTournaments } from "../context/TournamentContext";
import { useAuth } from "../context/AuthContext";
import { can } from "../utils/permissions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal =withReactContent(Swal);
const Tournaments = () => {
  const { user } = useAuth();
  const {
    tournaments,
    loading,
    addTournament,
    editTournament,
    removeTournament,
  } = useTournaments();

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
      name: "",
      sport: "",
      category: "",
      startDate: "",
      endDate: "",
      status: "pendiente",
    },
  });

  const submitHandler = async (data) => {
    setError("");

    try {

      if (editingId) {
        await editTournament(editingId, data);
        toast.success(
  "Torneo editado correctamente"
);
      } else {
        await addTournament(data);
        toast.success(
  "Torneo creado correctamente"
);
      }

      reset({
        name: "",
        sport: "",
        category: "",
        startDate: "",
        endDate: "",
        status: "pendiente",
      });

      setEditingId(null);
    } catch {
      setError("Error al guardar el torneo");
    }
  };

  const handleEdit = (tournament) => {
    setEditingId(tournament._id);

    setValue("name", tournament.name || "");
    setValue("sport", tournament.sport || "");
    setValue("category", tournament.category || "");
    setValue(
      "startDate",
      tournament.startDate ? tournament.startDate.slice(0, 10) : ""
    );
    setValue(
      "endDate",
      tournament.endDate ? tournament.endDate.slice(0, 10) : ""
    );
    setValue("status", tournament.status || "pendiente");
  };

  const handleCancel = () => {
    setEditingId(null);

    reset({
      name: "",
      sport: "",
      category: "",
      startDate: "",
      endDate: "",
      status: "pendiente",
    });
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
  title: "¿Eliminar torneo?",
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

    await removeTournament(id);
     toast.success(
  "Torneo eliminado correctamente"
);
    
  };

  return (
    <section className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
              Torneos deportivos
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Torneos deportivos
            </h1>
             
            
          </div>

          <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl font-semibold">
            {tournaments.length} torneos
          </div>
        </div>
{can(user, "tournament:create") && (
 
        <form
          onSubmit={handleSubmit(submitHandler)}
          noValidate
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            {editingId ? "Editar torneo" : "Nuevo torneo"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nombre
              </label>

              <input
                type="text"
                placeholder="Copa Verano"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("name", {
                  required: "El nombre es obligatorio",
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
                Deporte
              </label>

              <select
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("sport", {
                  required: "El deporte es obligatorio",
                })}
              >
                <option value="">Seleccionar deporte</option>
                <option value="Fútbol">Fútbol</option>
                <option value="Básquet">Básquet</option>
                <option value="Vóley">Vóley</option>
                <option value="Handball">Handball</option>
                <option value="Tenis">Tenis</option>
                <option value="Pádel">Pádel</option>
                <option value="Hockey">Hockey</option>
                <option value="Rugby">Rugby</option>
                <option value="E-Sports">E-Sports</option>
              </select>

              {errors.sport && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.sport.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Categoría
              </label>

              <select
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("category", {
                  required: "La categoría es obligatoria",
                })}
              >
                <option value="">Seleccionar categoría</option>
                <option value="Infantil">Infantil</option>
                <option value="Sub 13">Sub 13</option>
                <option value="Sub 15">Sub 15</option>
                <option value="Sub 17">Sub 17</option>
                <option value="Sub 18">Sub 18</option>
                <option value="Sub 21">Sub 21</option>
                <option value="Primera">Primera</option>
                <option value="Veteranos">Veteranos</option>
                <option value="Mixto">Mixto</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Fecha de inicio
              </label>

              <input
                type="date"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("startDate", {
                  required: "La fecha de inicio es obligatoria",
                })}
              />

              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Fecha de finalización
              </label>

              <input
                type="date"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("endDate")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Estado
              </label>

              <select
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("status", {
                  required: "El estado es obligatorio",
                })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="activo">Activo</option>
                <option value="finalizado">Finalizado</option>
              </select>

              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              {editingId ? "Guardar cambios" : "Crear torneo"}
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
              Listado de torneos
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-slate-500">Cargando torneos...</p>
          ) : tournaments.length === 0 ? (
            <p className="p-6 text-slate-500">
              Todavía no hay torneos cargados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Torneo</th>
                    <th className="px-6 py-4">Deporte</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {tournaments.map((tournament) => (
                    <tr key={tournament._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {tournament.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {tournament.sport}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {tournament.category}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {tournament.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {can(user, "tournament:update") && (
                          <button
                            onClick={() => handleEdit(tournament)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg font-semibold transition"
                          >
                            Editar
                          </button>
                           )}
                          {can(user, "tournament:delete") && (
                          <button
                            onClick={() => handleDelete(tournament._id)}
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

export default Tournaments;