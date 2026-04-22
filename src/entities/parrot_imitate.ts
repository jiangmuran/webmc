// Parrot mimicry. Parrots within 20 blocks of a hostile mob randomly
// emit that mob's sound id. Also vibe-dance near a jukebox.

export type HostileId =
  | 'zombie'
  | 'skeleton'
  | 'creeper'
  | 'spider'
  | 'enderman'
  | 'witch'
  | 'blaze'
  | 'elder_guardian';

export interface MimicQuery {
  nearestHostile: HostileId | null;
  distance: number;
  rand: () => number;
}

export const MIMIC_RADIUS = 20;

export function pickMimicSound(q: MimicQuery): string | null {
  if (!q.nearestHostile) return null;
  if (q.distance > MIMIC_RADIUS) return null;
  if (q.rand() < 0.005) return `webmc:entity.parrot.imitate.${q.nearestHostile}`;
  return null;
}

// Dance near jukebox.
export interface DanceQuery {
  withinJukeboxRange: boolean;
}

export const JUKEBOX_DANCE_RANGE = 3;

export function dances(q: DanceQuery): boolean {
  return q.withinJukeboxRange;
}

// Shoulder perch possible if tame and jumps onto player.
export interface PerchQuery {
  tame: boolean;
  playerHasOpenShoulder: boolean;
  withinDistance: number;
}

export function canPerch(q: PerchQuery): boolean {
  if (!q.tame) return false;
  if (!q.playerHasOpenShoulder) return false;
  return q.withinDistance <= 1.5;
}
