import Tournament from "../models/Tournament.js";

export const createTournament = async (req, res) => {
  try {
    const tournament = await Tournament.create(req.body);
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        message: "Torneo no encontrado",
      });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({
        message: "Torneo no encontrado",
      });
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        message: "Torneo no encontrado",
      });
    }

    res.json({
      message: "Torneo eliminado",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};