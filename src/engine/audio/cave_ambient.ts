// Rare cave-ambient "sounds" (distant growls, drips, echoes) fired
// in dark enclosed areas.

export interface AmbientCtx {
  lightLevel: number;
  skyAccessAbove: boolean;
  ticksSinceLastSound: number;
}

export const MIN_AMBIENT_INTERVAL_TICKS = 2400;
export const AMBIENT_CHANCE_PER_TICK = 1 / 3600;

export function canPlayAmbient(c: AmbientCtx, rand: () => number): boolean {
  if (c.lightLevel > 3 || c.skyAccessAbove) return false;
  if (c.ticksSinceLastSound < MIN_AMBIENT_INTERVAL_TICKS) return false;
  return rand() < AMBIENT_CHANCE_PER_TICK;
}

export const AMBIENT_POOL = [
  'ambient.cave',
  'ambient.cave.cave',
  'ambient.cave.rumble',
  'ambient.cave.drip',
  'ambient.cave.breath',
];

export function pickAmbient(rand: () => number): string {
  return AMBIENT_POOL[Math.floor(rand() * AMBIENT_POOL.length)] ?? 'ambient.cave';
}
