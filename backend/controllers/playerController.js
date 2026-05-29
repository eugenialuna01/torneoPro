import Player from "../models/Player.js";

export const createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);

    const populatedPlayer = await Player.findById(player._id).populate({
      path: "team",
      populate: {
        path: "tournament",
      },
    });

    res.status(201).json(populatedPlayer);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear jugador",
      error: error.message,
    });
  }
};

export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate({
        path: "team",
        populate: {
          path: "tournament",
        },
      })
      .sort({ createdAt: -1 });

    res.json(players);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener jugadores",
      error: error.message,
    });
  }
};

export const getPlayersByTeam = async (req, res) => {
  try {
    const players = await Player.find({
      team: req.params.teamId,
    }).populate({
      path: "team",
      populate: {
        path: "tournament",
      },
    });

    res.json(players);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener jugadores del equipo",
      error: error.message,
    });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate({
      path: "team",
      populate: {
        path: "tournament",
      },
    });

    if (!player) {
      return res.status(404).json({
        message: "Jugador no encontrado",
      });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar jugador",
      error: error.message,
    });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({
        message: "Jugador no encontrado",
      });
    }

    res.json({
      message: "Jugador eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar jugador",
      error: error.message,
    });
  }
};