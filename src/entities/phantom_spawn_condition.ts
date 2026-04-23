export interface SpawnCtx {
  playerInsomniaTicks: number;
  skyVisible: boolean;
  timeOfDay: number;
  lightLevel: number;
}

export const INSOMNIA_THRESHOLD = 72000;

export function isNight(t: number): boolean {
  const w = ((t % 24000) + 24000) % 24000;
  return w >= 13000 && w < 23000;
}

export function canSpawn(c: SpawnCtx): boolean {
  if (!c.skyVisible) return false;
  if (!isNight(c.timeOfDay)) return false;
  if (c.lightLevel > 7) return false;
  return c.playerInsomniaTicks >= INSOMNIA_THRESHOLD;
}
