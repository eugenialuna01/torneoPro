import mongoose from "mongoose";
import dotenv from "dotenv";

import Permission from "../models/Permission.js";
import Role from "../models/Roles.js";
import { connectDB } from "../config/dbConfig.js";

dotenv.config({path: "../.env",});

// =========================
// PERMISOS
// =========================
const initialPermissions = [
  // TORNEOS
  { name: "tournament:read", description: "Ver torneos" },
  { name: "tournament:create", description: "Crear torneos" },
  { name: "tournament:update", description: "Actualizar torneos" },
  { name: "tournament:delete", description: "Eliminar torneos" },

  // EQUIPOS
  { name: "team:read", description: "Ver equipos" },
  { name: "team:create", description: "Crear equipos" },
  { name: "team:update", description: "Actualizar equipos" },
  { name: "team:delete", description: "Eliminar equipos" },

  // JUGADORES
  { name: "player:read", description: "Ver jugadores" },
  { name: "player:create", description: "Crear jugadores" },
  { name: "player:update", description: "Actualizar jugadores" },
  { name: "player:delete", description: "Eliminar jugadores" },

  // PARTIDOS
  { name: "match:read", description: "Ver partidos" },
  { name: "match:create", description: "Crear partidos" },
  { name: "match:update", description: "Actualizar partidos o resultados" },
  { name: "match:delete", description: "Eliminar partidos" },

  // TABLA DE POSICIONES
  { name: "standings:read", description: "Ver tabla de posiciones" },
  { name: "standings:update", description: "Actualizar tabla de posiciones" },

  // USUARIOS
  { name: "user:read", description: "Ver usuarios" },
  { name: "user:update", description: "Actualizar usuarios" },
  { name: "user:delete", description: "Eliminar usuarios" },
];

// =========================
// ROLES
// =========================
const initialRoles = [
  {
    name: "usuario",
    description: "Usuario común. Puede ver torneos, equipos, partidos y posiciones.",
    permissions: [
      "tournament:read",
      "team:read",
      "player:read",
      "match:read",
      "standings:read",
    ],
  },

  {
    name: "entrenador",
    description: "Entrenador. Puede administrar su equipo y sus jugadores.",
    permissions: [
      "tournament:read",

      "team:read",
      "team:create",
      "team:update",

      "player:read",
      "player:create",
      "player:update",
      "player:delete",

      "match:read",

      "standings:read",
    ],
  },

  {
    name: "admin",
    description: "Administrador del sistema. Tiene acceso total.",
    permissions: [
      "tournament:read",
      "tournament:create",
      "tournament:update",
      "tournament:delete",

      "team:read",
      "team:create",
      "team:update",
      "team:delete",

      "player:read",
      "player:create",
      "player:update",
      "player:delete",

      "match:read",
      "match:create",
      "match:update",
      "match:delete",

      "standings:read",
      "standings:update",

      "user:read",
      "user:update",
      "user:delete",
    ],
  },
];

// =========================
// UPSERT PERMISSIONS
// =========================
async function upsertPermissions() {
  const permissionMap = {};

  for (const permission of initialPermissions) {
    const savedPermission = await Permission.findOneAndUpdate(
      { name: permission.name },
      { $set: permission },
      { upsert: true, new: true }
    );

    permissionMap[permission.name] = savedPermission._id;
  }

  return permissionMap;
}

// =========================
// UPSERT ROLES
// =========================
async function upsertRoles(permissionMap) {
  for (const role of initialRoles) {
    const permissionIds = role.permissions
      .map((permissionName) => permissionMap[permissionName])
      .filter(Boolean);

    await Role.findOneAndUpdate(
      { name: role.name },
      {
        $set: {
          name: role.name,
          description: role.description,
          permissions: permissionIds,
        },
      },
      { upsert: true, new: true }
    );

    console.log(`✔ Rol creado/actualizado: ${role.name}`);
  }
}

// =========================
// INIT
// =========================
async function init() {
  try {
    await connectDB();

    console.log("✅ Conectado a MongoDB");

    const permissionMap = await upsertPermissions();

    console.log("✔ Permisos creados/actualizados");

    await upsertRoles(permissionMap);

    console.log("✔ Roles creados/actualizados");
  } catch (error) {
    console.error("❌ Error al crear roles y permisos:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexión cerrada");
  }
}

init();