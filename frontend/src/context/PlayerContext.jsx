import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../api/torneoApi";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const res = await getPlayers();
      setPlayers(res.data);
    } catch (error) {
      console.log("Error al cargar jugadores", error);
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async (data) => {
    await createPlayer(data);
    await loadPlayers();
  };

  const editPlayer = async (id, data) => {
    await updatePlayer(id, data);
    await loadPlayers();
  };

  const removePlayer = async (id) => {
    await deletePlayer(id);
    await loadPlayers();
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        players,
        loading,
        loadPlayers,
        addPlayer,
        editPlayer,
        removePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayers = () => useContext(PlayerContext);
