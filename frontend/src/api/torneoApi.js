import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// =========================
// AUTH
// =========================
export const loginUser = (
  credentials
) =>
  api.post(
    "/auth/login",
    credentials
  );

export const registerUser = (
  data
) =>
  api.post(
    "/auth/register",
    data
  );
// =========================
// OBTENER TORNEOS
// =========================
export const getTournaments = () => {
  return api.get("/tournaments");
};

// =========================
// CREAR TORNEO
// =========================
export const createTournament = (data) => {
  return api.post("/tournaments", data);
};

// =========================
// ACTUALIZAR TORNEO
// =========================
export const updateTournament = (
  id,
  data
) => {
  return api.put(
    `/tournaments/${id}`,
    data
  );
};

// =========================
// ELIMINAR TORNEO
// =========================
export const deleteTournament = (
  id
) => {
  return api.delete(
    `/tournaments/${id}`


  );
};
//=========================
// EQUIPOS
// =========================
export const getTeams = () => {
  return api.get("/teams");
};

export const getTeamById = (id) => {
  return api.get(`/teams/${id}`);
};

export const createTeam = (data) => {
  return api.post("/teams", data);
};

export const updateTeam = (
  id,
  data
) => {
  return api.put(
    `/teams/${id}`,
    data
  );
};

export const deleteTeam = (id) => {
  return api.delete(
    `/teams/${id}`
  );
};
export const getMatches = () => {
  return api.get("/matches");
};

export const getMatchesByTournament = (tournamentId) => {
  return api.get(`/matches/tournament/${tournamentId}`);
};

export const createMatch = (data) => {
  return api.post("/matches", data);
};

export const updateMatchResult = (id, data) => {
  return api.put(`/matches/${id}/result`, data);
};

export const deleteMatch = (id) => {
  return api.delete(`/matches/${id}`);
};

export const getStandingsByTournament = (tournamentId) => {
  return api.get(`/matches/standings/${tournamentId}`);
};
export const getUsers = () => {
  return api.get("/users");
};

export const updateUser = (id, data) => {
  return api.put(`/users/${id}`, data);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};
export const getPlayers = () => {
  return api.get("/players");
};

export const getPlayersByTeam = (teamId) => {
  return api.get(`/players/team/${teamId}`);
};

export const createPlayer = (data) => {
  return api.post("/players", data);
};

export const updatePlayer = (id, data) => {
  return api.put(`/players/${id}`, data);
};

export const deletePlayer = (id) => {
  return api.delete(`/players/${id}`);
};


export default api;