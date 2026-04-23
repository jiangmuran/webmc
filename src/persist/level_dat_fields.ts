// level.dat known fields used during import → webmc save. We only
// accept the behavioral fields; never Mojang copyrighted brand strings.

export interface LevelDatFields {
  seed: string;
  spawnX: number;
  spawnY: number;
  spawnZ: number;
  gameTime: number; // ticks
  dayTime: number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  hardcore: boolean;
  generatorName: string;
}

export function sanitizeForImport(raw: Partial<LevelDatFields>): LevelDatFields {
  return {
    seed: raw.seed ?? '0',
    spawnX: Math.floor(raw.spawnX ?? 0),
    spawnY: Math.floor(raw.spawnY ?? 64),
    spawnZ: Math.floor(raw.spawnZ ?? 0),
    gameTime: Math.max(0, raw.gameTime ?? 0),
    dayTime: (((raw.dayTime ?? 0) % 24000) + 24000) % 24000,
    difficulty: raw.difficulty ?? 'normal',
    hardcore: raw.hardcore ?? false,
    generatorName: 'webmc_default', // rebranded — we never ship MC generator name
  };
}

export function extractSeedDigest(seed: string): string {
  // Trivial pseudo-hash: keep numeric string or hash characters.
  if (/^-?\d+$/.test(seed)) return seed;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return String(h);
}
