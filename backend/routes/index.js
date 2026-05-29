import { Router } from "express";

import authRouter from "./authRouter.js";
import tournamentRoutes from "./tournamentRoutes.js";
import teamRoutes from "./teamRoutes.js";
import matchRoutes from "./matchRoutes.js";
import userRoutes from "./userRoutes.js";
import playerRoutes from "./playerRoutes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/tournaments", tournamentRoutes);
router.use("/teams", teamRoutes);
router.use("/matches", matchRoutes);
router.use("/users", userRoutes);
router.use("/players", playerRoutes);

export default router;
