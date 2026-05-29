import { Router } from "express";

import {
  createPlayer,
  getPlayers,
  getPlayersByTeam,
  updatePlayer,
  deletePlayer,
} from "../controllers/playerController.js";

const router = Router();

router.post("/", createPlayer);
router.get("/", getPlayers);
router.get("/team/:teamId", getPlayersByTeam);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);

export default router;