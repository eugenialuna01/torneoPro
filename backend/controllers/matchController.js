import Match from "../models/Match.js";
import Team from "../models/Team.js";
import { toast } from "react-toastify";

export const createMatch = async (req, res) => {
  try {
    const match = await Match.create(req.body);

    const populatedMatch = await Match.findById(match._id)
      .populate("tournament")
      .populate("localTeam")
      .populate("visitorTeam");

    res.status(201).json(populatedMatch);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear partido",
      error: error.message,
    });
  }
};

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("tournament")
      .populate("localTeam")
      .populate("visitorTeam")
      .sort({ date: 1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener partidos",
      error: error.message,
    });
  }
};

export const getMatchesByTournament = async (req, res) => {
  try {
    const matches = await Match.find({
      tournament: req.params.tournamentId,
    })
      .populate("tournament")
      .populate("localTeam")
      .populate("visitorTeam")
      .sort({ date: 1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener partidos del torneo",
      error: error.message,
    });
  }
};

export const updateMatchResult = async (req, res) => {
  try {
    const { localScore, visitorScore } = req.body;

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      {
        localScore,
        visitorScore,
        status: "jugado",
      },
      { new: true }
    )
      .populate("tournament")
      .populate("localTeam")
      .populate("visitorTeam");

    if (!match) {
      return res.status(404).json({
        message: "Partido no encontrado",
      });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({
      message: "Error al cargar resultado",
      error: error.message,
    });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Partido no encontrado",
      });
    }

    res.json({
      message: "Partido eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar partido",
      error: error.message,
    });
  }
};

export const getStandingsByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const teams = await Team.find({
      tournament: tournamentId,
    });

    const matches = await Match.find({
      tournament: tournamentId,
      status: "jugado",
    });

    const table = teams.map((team) => ({
      teamId: team._id,
      team: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }));

    const findTeam = (id) =>
      table.find((item) => item.teamId.toString() === id.toString());

    matches.forEach((match) => {
      const local = findTeam(match.localTeam);
      const visitor = findTeam(match.visitorTeam);

      if (!local || !visitor) return;

      local.played += 1;
      visitor.played += 1;

      local.goalsFor += match.localScore;
      local.goalsAgainst += match.visitorScore;

      visitor.goalsFor += match.visitorScore;
      visitor.goalsAgainst += match.localScore;

      if (match.localScore > match.visitorScore) {
        local.won += 1;
        local.points += 3;

        visitor.lost += 1;
      } else if (match.localScore < match.visitorScore) {
        visitor.won += 1;
        visitor.points += 3;

        local.lost += 1;
      } else {
        local.drawn += 1;
        visitor.drawn += 1;

        local.points += 1;
        visitor.points += 1;
      }
    });

    table.forEach((item) => {
      item.goalDifference = item.goalsFor - item.goalsAgainst;
    });

    table.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }
      return b.goalsFor - a.goalsFor;
    });

    res.json(table);
  } catch (error) {
    res.status(500).json({
      message: "Error al calcular tabla de posiciones",
      error: error.message,
    });
  }
};