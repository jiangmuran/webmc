// World-level persistent header (level.dat-equivalent). Stores seed,
// game rules, spawn point, time, weather, difficulty.

export interface GameRules {
  doDaylightCycle: boolean;
  doMobSpawning: boolean;
  doWeatherCycle: boolean;
  mobGriefing: boolean;
  keepInventory: boolean;
  showDeathMessages: boolean;
  pvp: boolean;
}

export interface WorldHeader {
  schemaVersion: number;
  name: string;
  seed: string;
  spawnPoint: { x: number; y: number; z: number };
  worldTick: number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  isHardcore: boolean;
  gameRules: GameRules;
  createdAtMs: number;
  lastPlayedAtMs: number;
}

export const WORLD_SCHEMA = 1;

export function defaultRules(): GameRules {
  return {
    doDaylightCycle: true,
    doMobSpawning: true,
    doWeatherCycle: true,
    mobGriefing: true,
    keepInventory: false,
    showDeathMessages: true,
    pvp: true,
  };
}

export function makeHeader(name: string, seed: string, nowMs: number): WorldHeader {
  return {
    schemaVersion: WORLD_SCHEMA,
    name,
    seed,
    spawnPoint: { x: 0, y: 64, z: 0 },
    worldTick: 0,
    difficulty: 'normal',
    isHardcore: false,
    gameRules: defaultRules(),
    createdAtMs: nowMs,
    lastPlayedAtMs: nowMs,
  };
}

export function touch(h: WorldHeader, nowMs: number): void {
  h.lastPlayedAtMs = nowMs;
}
