import { Link } from "react-router-dom";

import { useTournaments } from "../context/TournamentContext";
import { useTeams } from "../context/TeamContext";
import { useMatches } from "../context/MatchContext";

const Home = () => {
  const { tournaments } = useTournaments();
  const { teams } = useTeams();
  const { matches } = useMatches();

  const activeTournaments = tournaments.filter(
    (tournament) => tournament.status === "activo"
  );

  const playedMatches = matches.filter(
    (match) => match.status === "jugado"
  );

  const latestMatches = matches.slice(0, 3);

  return (
    <section className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="bg-linear-to-r from-red-800 via-red-700 to-black rounded-3xl shadow-xl p-10 text-white">
          <p className="text-sm font-bold uppercase text-red-200 mb-3">
            Panel deportivo
          </p>

          <h1 className="text-5xl font-black">
            Torneos Deportivos
          </h1>

          <p className="text-red-100 mt-4 max-w-2xl">
            Administrá torneos, equipos, fixtures, resultados y tablas de posiciones.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/torneos"
              className="bg-white text-red-700 px-6 py-3 rounded-xl font-bold"
            >
              Ver torneos
            </Link>

            <Link
              to="/partidos"
              className="bg-black/30 px-6 py-3 rounded-xl font-bold border border-white/20"
            >
              Ver partidos
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-slate-500 font-semibold">
              Torneos
            </p>

            <h2 className="text-4xl font-black text-red-700">
              {tournaments.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-slate-500 font-semibold">
              Activos
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {activeTournaments.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-slate-500 font-semibold">
              Equipos
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {teams.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-slate-500 font-semibold">
              Partidos jugados
            </p>

            <h2 className="text-4xl font-black text-amber-600">
              {playedMatches.length}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border overflow-hidden">
            <div className="bg-black text-white px-6 py-4">
              <h2 className="text-xl font-black">
                Fixture reciente
              </h2>
            </div>

            {latestMatches.length === 0 ? (
              <p className="p-6 text-slate-500">
                Todavía no hay partidos cargados.
              </p>
            ) : (
              <div className="divide-y">
                {latestMatches.map((match) => (
                  <div
                    key={match._id}
                    className="p-6 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm text-slate-500 font-semibold">
                        {match.tournament?.name || "Sin torneo"}
                      </p>

                      <h3 className="text-xl font-black text-slate-900">
                        {match.localTeam?.name} vs {match.visitorTeam?.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Resultado
                      </p>

                      <h2 className="text-2xl font-black text-red-700">
                        {match.status === "jugado"
                          ? `${match.localScore} - ${match.visitorScore}`
                          : "Pendiente"}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            <div className="bg-red-700 text-white px-6 py-4">
              <h2 className="text-xl font-black">
                Torneos activos
              </h2>
            </div>

            {activeTournaments.length === 0 ? (
              <p className="p-6 text-slate-500">
                No hay torneos activos.
              </p>
            ) : (
              <div className="divide-y">
                {activeTournaments.map((tournament) => (
                  <div
                    key={tournament._id}
                    className="p-5"
                  >
                    <h3 className="font-black text-slate-900">
                      {tournament.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {tournament.sport} - {tournament.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Home;