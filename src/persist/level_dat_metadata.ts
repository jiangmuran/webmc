export interface LevelDat {
  version: number;
  worldName: string;
  createdAtMs: number;
  lastPlayedMs: number;
  seed: number;
  dayTime: number;
  gameType: 0 | 1 | 2 | 3;
  difficulty: 0 | 1 | 2 | 3;
  hardcore: boolean;
  allowCommands: boolean;
  generatorName: string;
  spawnX: number;
  spawnY: number;
  spawnZ: number;
}

export const CURRENT_LEVEL_DAT_VERSION = 3;

export function createDefault(worldName: string, seed: number, now: number): LevelDat {
  return {
    version: CURRENT_LEVEL_DAT_VERSION,
    worldName,
    createdAtMs: now,
    lastPlayedMs: now,
    seed,
    dayTime: 0,
    gameType: 0,
    difficulty: 2,
    hardcore: false,
    allowCommands: true,
    generatorName: 'default',
    spawnX: 0,
    spawnY: 64,
    spawnZ: 0,
  };
}

export function isCurrent(d: LevelDat): boolean {
  return d.version === CURRENT_LEVEL_DAT_VERSION;
}

export function touchLastPlayed(d: LevelDat, now: number): LevelDat {
  return { ...d, lastPlayedMs: now };
}
