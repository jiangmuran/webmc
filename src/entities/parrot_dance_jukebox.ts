// Parrots dance when a jukebox within 3 blocks is playing a music disc.

export const PARROT_DANCE_RADIUS = 3;

export interface ParrotDanceCtx {
  jukeboxPos: { x: number; y: number; z: number } | null;
  jukeboxPlaying: boolean;
  parrotPos: { x: number; y: number; z: number };
}

export function isDancing(c: ParrotDanceCtx): boolean {
  if (!c.jukeboxPos || !c.jukeboxPlaying) return false;
  const d = Math.hypot(
    c.jukeboxPos.x - c.parrotPos.x,
    c.jukeboxPos.y - c.parrotPos.y,
    c.jukeboxPos.z - c.parrotPos.z,
  );
  return d <= PARROT_DANCE_RADIUS;
}

export function stopDanceOnEject(): boolean {
  return true;
}
