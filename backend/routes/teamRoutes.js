import { Router } from "express";

import {
  createTeam,
  getTeams,
  getTeamsByTournament,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";

const router = Router();

router.post("/", createTeam);

router.get("/", getTeams);

// EQUIPOS POR TORNEO
router.get(
  "/tournament/:tournamentId",
  getTeamsByTournament
);

router.put("/:id", updateTeam);

router.delete("/:id", deleteTeam);

export default router;