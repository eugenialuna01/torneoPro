import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

import Team from "../models/Team.js";
import Tournament from "../models/Tournament.js";
import { connectDB } from "../config/dbConfig.js";

dotenv.config({path: "../.env",});

const API_URL =
  "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Spanish%20La%20Liga";

const TOURNAMENT_NAME = "La Liga Española";


async function getOrCreateTournament() {
  const tournament =
    await Tournament.findOneAndUpdate(
      { name: TOURNAMENT_NAME },
      {
        $setOnInsert: {
          name: TOURNAMENT_NAME,
          sport: "Fútbol",
          category: "Primera",
          startDate: new Date(),
          status: "activo",
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

  return tournament;
}

async function importTeams(tournamentId) {
  const response = await axios.get(API_URL);

  const externalTeams =
    response.data.teams || [];

  for (const externalTeam of externalTeams) {
    await Team.findOneAndUpdate(
      {
        name: externalTeam.strTeam,
        tournament: tournamentId,
      },
      {
        $set: {
          name: externalTeam.strTeam,
          coachName: "Sin entrenador",
          tournament: tournamentId,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log(
      `✔ Equipo importado/actualizado: ${externalTeam.strTeam}`
    );
  }
}

// =========================
// INIT
// =========================
async function init() {
  try {
    await connectDB();

    console.log("✅ Conectado a MongoDB");

    const tournament =
      await getOrCreateTournament();

    console.log(
      `✔ Torneo listo: ${tournament.name}`
    );

    await importTeams(tournament._id);

    console.log(
      "✔ Equipos importados correctamente"
    );
  } catch (error) {
    console.error(
      "❌ Error al importar equipos:",
      error
    );
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexión cerrada");
  }
}

init();