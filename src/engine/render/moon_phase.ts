export const PHASE_COUNT = 8;

export function phaseForDay(dayNumber: number): number {
  const d = Math.floor(dayNumber);
  return ((d % PHASE_COUNT) + PHASE_COUNT) % PHASE_COUNT;
}

export function lightBoostForMobSpawning(phase: number): number {
  const fullMoon = phase === 0;
  return fullMoon ? 1 : 0;
}

export function textureAtlasOffset(phase: number): number {
  return phase / PHASE_COUNT;
}
