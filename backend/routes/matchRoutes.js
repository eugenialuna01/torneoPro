import { Router } from "express";

import {
  createMatch,
  getMatches,
  getMatchesByTournament,
  updateMatchResult,
  deleteMatch,
  getStandingsByTournament,
} from "../controllers/matchController.js";

const router = Router();

router.post("/", createMatch);

router.get("/", getMatches);

router.get(
  "/tournament/:tournamentId",
  getMatchesByTournament
);

router.put(
  "/:id/result",
  updateMatchResult
);

router.delete(
  "/:id",
  deleteMatch
);

router.get(
  "/standings/:tournamentId",
  getStandingsByTournament
);

export default router;