import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
} from "../api/torneoApi";

// =========================
// CONTEXT
// =========================
const TournamentContext =
  createContext(null);

// =========================
// PROVIDER
// =========================
export const TournamentProvider = ({
  children,
}) => {

  const [tournaments, setTournaments] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // OBTENER TORNEOS
  // =========================
  const loadTournaments =
    async () => {

      try {

        setLoading(true);

        const res =
          await getTournaments();

        setTournaments(res.data);

      } catch (error) {

        console.log(
          "Error al cargar torneos",
          error
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================
  // CREAR
  // =========================
  const addTournament =
    async (data) => {

      try {

        await createTournament(
          data
        );

        await loadTournaments();

      } catch (error) {

        console.log(
          "Error al crear torneo",
          error
        );

      }
    };

  // =========================
  // ACTUALIZAR
  // =========================
  const editTournament =
    async (id, data) => {

      try {

        await updateTournament(
          id,
          data
        );

        await loadTournaments();

      } catch (error) {

        console.log(
          "Error al actualizar torneo",
          error
        );

      }
    };

  // =========================
  // ELIMINAR
  // =========================
  const removeTournament =
    async (id) => {

      try {

        await deleteTournament(id);

        await loadTournaments();

      } catch (error) {

        console.log(
          "Error al eliminar torneo",
          error
        );

      }
    };

  // =========================
  // LOAD INICIAL
  // =========================
  useEffect(() => {

    loadTournaments();

  }, []);

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        loading,
        loadTournaments,
        addTournament,
        editTournament,
        removeTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

// =========================
// CUSTOM HOOK
// =========================
// eslint-disable-next-line react-refresh/only-export-components
export const useTournaments = () =>  useContext(TournamentContext);
