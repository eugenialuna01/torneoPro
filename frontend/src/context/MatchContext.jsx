import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMatches,
  createMatch,
  updateMatchResult,
  deleteMatch,
  getStandingsByTournament,
} from "../api/torneoApi";

const MatchContext = createContext(null);

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMatches = async () => {
    try {
      setLoading(true);

      const res = await getMatches();

      setMatches(res.data);
    } catch (error) {
      console.log("Error al cargar partidos", error);
    } finally {
      setLoading(false);
    }
  };

  const addMatch = async (data) => {
    try {
      await createMatch(data);
      await loadMatches();
    } catch (error) {
      console.log("Error al crear partido", error);
    }
  };

  const addResult = async (id, data) => {
    try {
      await updateMatchResult(id, data);
      await loadMatches();
    } catch (error) {
      console.log("Error al cargar resultado", error);
    }
  };

  const removeMatch = async (id) => {
    try {
      await deleteMatch(id);
      await loadMatches();
    } catch (error) {
      console.log("Error al eliminar partido", error);
    }
  };

  const loadStandings = async (tournamentId) => {
    try {
      if (!tournamentId) {
        setStandings([]);
        return;
      }

      const res = await getStandingsByTournament(tournamentId);

      setStandings(res.data);
    } catch (error) {
      console.log("Error al cargar tabla de posiciones", error);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <MatchContext.Provider
      value={{
        matches,
        standings,
        loading,
        loadMatches,
        addMatch,
        addResult,
        removeMatch,
        loadStandings,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMatches = () => useContext(MatchContext);

