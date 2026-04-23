export interface Manifest {
  worldName: string;
  seed: number;
  version: number;
  gameMode: 'survival' | 'creative' | 'adventure' | 'spectator';
  hardcore: boolean;
  createdAt: number;
  updatedAt: number;
  chunkCount: number;
}

export const CURRENT_VERSION = 1;

export function make(name: string, seed: number, gameMode: Manifest['gameMode']): Manifest {
  const now = Date.now();
  return {
    worldName: name,
    seed,
    version: CURRENT_VERSION,
    gameMode,
    hardcore: false,
    createdAt: now,
    updatedAt: now,
    chunkCount: 0,
  };
}

export function touch(m: Manifest): Manifest {
  return { ...m, updatedAt: Date.now() };
}

export function needsMigration(m: Manifest): boolean {
  return m.version < CURRENT_VERSION;
}
