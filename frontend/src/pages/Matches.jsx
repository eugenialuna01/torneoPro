import { useState } from "react";
import { useForm } from "react-hook-form";

import { useMatches } from "../context/MatchContext";
import { useTournaments } from "../context/TournamentContext";
import { useTeams } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import { can } from "../utils/permissions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";


const MySwal =withReactContent(Swal);
const Matches = () => {
  const { user } = useAuth();
  const {
    matches,
    standings,
    loading,
    addMatch,
    addResult,
    removeMatch,
    loadStandings,
  } = useMatches();

  const { tournaments } = useTournaments();
  const { teams } = useTeams();

  const [selectedTournament, setSelectedTournament] = useState("");
  const [resultMatchId, setResultMatchId] = useState(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tournament: "",
      localTeam: "",
      visitorTeam: "",
      date: "",
    },
  });

  const {
    register: registerResult,
    handleSubmit: handleSubmitResult,
    reset: resetResult,
    setValue: setResultValue,
    formState: { errors: resultErrors },
  } = useForm({
    defaultValues: {
      localScore: "",
      visitorScore: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedTournament = watch("tournament");

  const filteredTeams = teams.filter((team) => {
    const teamTournamentId =
      team.tournament?._id || team.tournament;

    return teamTournamentId === watchedTournament;
  });

  const submitHandler = async (data) => {
    setError("");

    if (data.localTeam === data.visitorTeam) {
      setError("El equipo local y visitante no pueden ser iguales");
      return;
    }

    await addMatch(data);
    toast.success(
  "Partido creado correctamente"
);
    reset({
      tournament: "",
      localTeam: "",
      visitorTeam: "",
      date: "",
    });
  };

  const handleResultClick = (match) => {
    setResultMatchId(match._id);

    setResultValue(
      "localScore",
      match.localScore ?? ""
    );

    setResultValue(
      "visitorScore",
      match.visitorScore ?? ""
    );
  };

  const submitResultHandler = async (data) => {
    await addResult(resultMatchId, {
      localScore: Number(data.localScore),
      visitorScore: Number(data.visitorScore),
    });

    setResultMatchId(null);

    resetResult({
      localScore: "",
      visitorScore: "",
    });

    if (selectedTournament) {
      await loadStandings(selectedTournament);
      
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
  title: "¿Eliminar partido?",
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

    await removeMatch(id);
 
   toast.success(
    "Partido eliminado correctamente"
  );

    if (selectedTournament) {
      await loadStandings(selectedTournament);
    }
  };

  const handleTournamentTable = async (e) => {
    const tournamentId = e.target.value;

    setSelectedTournament(tournamentId);

    await loadStandings(tournamentId);
    
  };

  return (
    <section className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
              Fixture y resultados
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Partidos
            </h1>

            
          </div>

          <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl font-semibold">
            {matches.length} partidos
          </div>
        </div>
      {can(user, "match:create") && (
        <form
          onSubmit={handleSubmit(submitHandler)}
          noValidate
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            Crear partido
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Equipo local
              </label>

              <select
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("localTeam", {
                  required: "Selecciona el equipo local",
                })}
              >
                <option value="">Seleccionar local</option>

                {filteredTeams.map((team) => (
                  <option
                    key={team._id}
                    value={team._id}
                  >
                    {team.name}
                  </option>
                ))}
              </select>

              {errors.localTeam && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.localTeam.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Equipo visitante
              </label>

              <select
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("visitorTeam", {
                  required: "Selecciona el equipo visitante",
                })}
              >
                <option value="">Seleccionar visitante</option>

                {filteredTeams.map((team) => (
                  <option
                    key={team._id}
                    value={team._id}
                  >
                    {team.name}
                  </option>
                ))}
              </select>

              {errors.visitorTeam && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.visitorTeam.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Fecha
              </label>

              <input
                type="date"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                {...register("date", {
                  required: "La fecha es obligatoria",
                })}
              />

              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-4">
              {error}
            </p>
          )}

          <div className="mt-6">
            
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Crear partido
            </button>
          </div>
        </form>
           )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Fixture
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-slate-500">
              Cargando partidos...
            </p>
          ) : matches.length === 0 ? (
            <p className="p-6 text-slate-500">
              Todavía no hay partidos cargados.
            </p>
          ) : (

            <div className="overflow-x-auto">
            
              
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Torneo</th>
                    <th className="px-6 py-4">Partido</th>
                    <th className="px-6 py-4">Resultado</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {matches.map((match) => (
                    <tr
                      key={match._id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-slate-600">
                        {match.tournament?.name || "Sin torneo"}
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {match.localTeam?.name}
                        {" vs "}
                        {match.visitorTeam?.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {match.status === "jugado"
                          ? `${match.localScore} - ${match.visitorScore}`
                          : "Pendiente"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {match.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {can(user, "match:update") && (
                          <button
                            onClick={() => handleResultClick(match)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-semibold transition"
                          >
                            Resultado
                          </button>
                            )}
                           {can(user, "match:delete") && ( 
                          <button
                            onClick={() => handleDelete(match._id)}
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

        {resultMatchId && (
          <form
            onSubmit={handleSubmitResult(submitResultHandler)}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              Cargar resultado
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Goles local
                </label>

                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                  {...registerResult("localScore", {
                    required: "Campo obligatorio",
                  })}
                />

                {resultErrors.localScore && (
                  <p className="text-red-500 text-sm mt-1">
                    {resultErrors.localScore.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Goles visitante
                </label>

                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
                  {...registerResult("visitorScore", {
                    required: "Campo obligatorio",
                  })}
                />

                {resultErrors.visitorScore && (
                  <p className="text-red-500 text-sm mt-1">
                    {resultErrors.visitorScore.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                Guardar resultado
              </button>

              <button
                type="button"
                onClick={() => setResultMatchId(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-3 rounded-xl transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {can(user, "standings:read") && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-800">
              Tabla de posiciones
            </h2>

            <select
              value={selectedTournament}
              onChange={handleTournamentTable}
              className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
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
          </div>

                    {standings.length === 0 ? (
            <p className="p-6 text-slate-500">
              Seleccioná un torneo para ver la tabla.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Equipo</th>
                    <th className="px-6 py-4">PJ</th>
                    <th className="px-6 py-4">G</th>
                    <th className="px-6 py-4">E</th>
                    <th className="px-6 py-4">P</th>
                    <th className="px-6 py-4">GF</th>
                    <th className="px-6 py-4">GC</th>
                    <th className="px-6 py-4">DG</th>
                    <th className="px-6 py-4">Pts</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {standings.map((item) => (
                    <tr
                      key={item.teamId}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {item.team}
                      </td>

                      <td className="px-6 py-4">
                        {item.played}
                      </td>

                      <td className="px-6 py-4">
                        {item.won}
                      </td>

                      <td className="px-6 py-4">
                        {item.drawn}
                      </td>

                      <td className="px-6 py-4">
                        {item.lost}
                      </td>

                      <td className="px-6 py-4">
                        {item.goalsFor}
                      </td>

                      <td className="px-6 py-4">
                        {item.goalsAgainst}
                      </td>

                      <td className="px-6 py-4">
                        {item.goalDifference}
                      </td>

                      <td className="px-6 py-4 font-bold text-green-700">
                        {item.points}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
        )}

      </div>
    </section>
  );
};

export default Matches;