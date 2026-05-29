export const roleMap = {

  // =========================
  // USUARIO
  // =========================
  '6a15f3e4e38ac597447ac117': {
    name: 'user',
    permissions: [
      'tournament:read',
      'team:read',
      'player:read',
      'match:read',
      'standings:read'
    ]
  },

  // =========================
  // ENTRENADOR
  // =========================
  '6a15f3e5e38ac597447ac118': {
    name: 'coach',
    permissions: [

      // TORNEOS
      'tournament:read',

      // EQUIPOS
      'team:read',
      'team:create',
      'team:update',

      // JUGADORES
      'player:read',
      'player:create',
      'player:update',
      'player:delete',

      // PARTIDOS
      'match:read',

      // POSICIONES
      'standings:read'
    ]
  },

  // =========================
  // ADMIN
  // =========================
  '6a15f3e5e38ac597447ac119': {
    name: 'admin',
    permissions: [

      // TORNEOS
      'tournament:read',
      'tournament:create',
      'tournament:update',
      'tournament:delete',

      // EQUIPOS
      'team:read',
      'team:create',
      'team:update',
      'team:delete',

      // JUGADORES
      'player:read',
      'player:create',
      'player:update',
      'player:delete',

      // PARTIDOS
      'match:read',
      'match:create',
      'match:update',
      'match:delete',

      // POSICIONES
      'standings:read',
      'standings:update',

      // USUARIOS
      'user:read',
      'user:update',
      'user:delete'
    ]
  }

};