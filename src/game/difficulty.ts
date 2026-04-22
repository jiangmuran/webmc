// Difficulty + gamemode. Difficulty scales mob damage and hunger effects;
// gamemode determines damage + break behavior.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';
export type Gamemode = 'survival' | 'creative' | 'adventure' | 'spectator';

export interface DifficultySettings {
  mobDamageMultiplier: number;
  starvationCanKill: boolean;
  hostileSpawnRate: number; // 0 = none, 1 = normal
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  peaceful: { mobDamageMultiplier: 0, starvationCanKill: false, hostileSpawnRate: 0 },
  easy: { mobDamageMultiplier: 0.5, starvationCanKill: false, hostileSpawnRate: 0.6 },
  normal: { mobDamageMultiplier: 1, starvationCanKill: false, hostileSpawnRate: 1 },
  hard: { mobDamageMultiplier: 1.5, starvationCanKill: true, hostileSpawnRate: 1.5 },
};

export interface GamemodeSettings {
  canTakeDamage: boolean;
  infiniteBlocks: boolean; // placement does not consume items
  instantBreak: boolean; // break is 0ms
  flyingEnabled: boolean;
  noclip: boolean;
  inventoryVisible: boolean;
}

export const GAMEMODE_SETTINGS: Record<Gamemode, GamemodeSettings> = {
  survival: {
    canTakeDamage: true,
    infiniteBlocks: false,
    instantBreak: false,
    flyingEnabled: false,
    noclip: false,
    inventoryVisible: true,
  },
  creative: {
    canTakeDamage: false,
    infiniteBlocks: true,
    instantBreak: true,
    flyingEnabled: true,
    noclip: false,
    inventoryVisible: true,
  },
  adventure: {
    canTakeDamage: true,
    infiniteBlocks: false,
    instantBreak: false,
    flyingEnabled: false,
    noclip: false,
    inventoryVisible: true,
  },
  spectator: {
    canTakeDamage: false,
    infiniteBlocks: false,
    instantBreak: false,
    flyingEnabled: true,
    noclip: true,
    inventoryVisible: false,
  },
};

export function mobDamageAfterDifficulty(baseDamage: number, difficulty: Difficulty): number {
  return baseDamage * DIFFICULTY_SETTINGS[difficulty].mobDamageMultiplier;
}
