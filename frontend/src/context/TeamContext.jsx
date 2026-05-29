import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../api/torneoApi";

const TeamContext = createContext(null);

export const TeamProvider = ({
  children,
}) => {

  const [teams, setTeams] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // OBTENER
  const loadTeams = async () => {
    try {

      setLoading(true);

      const res = await getTeams();

      setTeams(res.data);

    } catch (error) {

      console.log(
        "Error al cargar equipos",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  // CREAR
  const addTeam = async (data) => {
    try {

      await createTeam(data);

      await loadTeams();

    } catch (error) {

      console.log(
        "Error al crear equipo",
        error
      );

    }
  };

  // ACTUALIZAR
  const editTeam = async (
    id,
    data
  ) => {

    try {

      await updateTeam(id, data);

      await loadTeams();

    } catch (error) {

      console.log(
        "Error al actualizar equipo",
        error
      );

    }
  };

  // ELIMINAR
  const removeTeam = async (id) => {
    try {

      await deleteTeam(id);

      await loadTeams();

    } catch (error) {

      console.log(
        "Error al eliminar equipo",
        error
      );

    }
  };

  useEffect(() => {

    loadTeams();

  }, []);

  return (
    <TeamContext.Provider
      value={{
        teams,
        loading,
        loadTeams,
        addTeam,
        editTeam,
        removeTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTeams = () => useContext(TeamContext);

