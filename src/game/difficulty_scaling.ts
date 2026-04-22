// Difficulty scaling. Mob damage, spawn weights, natural regen,
// hunger damage, etc. scale with the difficulty setting.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export interface DifficultyProfile {
  mobDamageMult: number;
  hungerCanStarveToDeath: boolean;
  naturalRegen: boolean;
  hostileMobsSpawn: boolean;
  zombieBreaksDoor: boolean;
  phantomsSpawn: boolean;
}

const PROFILES: Record<Difficulty, DifficultyProfile> = {
  peaceful: {
    mobDamageMult: 0,
    hungerCanStarveToDeath: false,
    naturalRegen: true,
    hostileMobsSpawn: false,
    zombieBreaksDoor: false,
    phantomsSpawn: false,
  },
  easy: {
    mobDamageMult: 0.5,
    hungerCanStarveToDeath: false,
    naturalRegen: true,
    hostileMobsSpawn: true,
    zombieBreaksDoor: false,
    phantomsSpawn: true,
  },
  normal: {
    mobDamageMult: 1,
    hungerCanStarveToDeath: false,
    naturalRegen: true,
    hostileMobsSpawn: true,
    zombieBreaksDoor: false,
    phantomsSpawn: true,
  },
  hard: {
    mobDamageMult: 1.5,
    hungerCanStarveToDeath: true,
    naturalRegen: true,
    hostileMobsSpawn: true,
    zombieBreaksDoor: true,
    phantomsSpawn: true,
  },
};

export function profileFor(d: Difficulty): DifficultyProfile {
  return PROFILES[d];
}

export function scaleMobDamage(d: Difficulty, base: number): number {
  return base * PROFILES[d].mobDamageMult;
}
