import Team from "../models/Team.js";

// =========================
// CREAR EQUIPO
// =========================
export const createTeam = async (
  req,
  res
) => {

  try {

    const team =
      await Team.create(req.body);

    res.status(201).json(team);

  } catch (error) {

    res.status(500).json({
      message:
        "Error al crear equipo",
      error: error.message,
    });

  }
};

// =========================
// OBTENER EQUIPOS
// =========================
export const getTeams = async (
  req,
  res
) => {

  try {

    // IMPORTANTE:
    // populate("tournament")
    // permite traer los datos
    // completos del torneo
    const teams =
      await Team.find()
        .populate("tournament")
        .sort({
          createdAt: -1,
        });

    res.json(teams);

  } catch (error) {

    res.status(500).json({
      message:
        "Error al obtener equipos",
      error: error.message,
    });

  }
};

// =========================
// OBTENER EQUIPOS
// POR TORNEO
// =========================
export const getTeamsByTournament =
  async (req, res) => {

    try {

      const teams =
        await Team.find({
          tournament:
            req.params.tournamentId,
        }).populate(
          "tournament"
        );

      res.json(teams);

    } catch (error) {

      res.status(500).json({
        message:
          "Error al obtener equipos del torneo",
        error: error.message,
      });

    }
  };

// =========================
// ACTUALIZAR EQUIPO
// =========================
export const updateTeam = async (
  req,
  res
) => {

  try {

    const team =
      await Team.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate("tournament");

    if (!team) {

      return res
        .status(404)
        .json({
          message:
            "Equipo no encontrado",
        });

    }

    res.json(team);

  } catch (error) {

    res.status(500).json({
      message:
        "Error al actualizar equipo",
      error: error.message,
    });

  }
};

// =========================
// ELIMINAR EQUIPO
// =========================
export const deleteTeam = async (
  req,
  res
) => {

  try {

    const team =
      await Team.findByIdAndDelete(
        req.params.id
      );

    if (!team) {

      return res
        .status(404)
        .json({
          message:
            "Equipo no encontrado",
        });

    }

    res.json({
      message:
        "Equipo eliminado correctamente",
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Error al eliminar equipo",
      error: error.message,
    });

  }
};