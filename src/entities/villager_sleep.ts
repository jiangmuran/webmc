export interface VillagerSchedule {
  timeOfDay: number;
  hasBedClaimed: boolean;
  isRaidActive: boolean;
}

export const SLEEP_START = 12000;
export const WAKE = 24000;

export function shouldSleep(s: VillagerSchedule): boolean {
  if (s.isRaidActive) return false;
  if (!s.hasBedClaimed) return false;
  const t = ((s.timeOfDay % 24000) + 24000) % 24000;
  return t >= SLEEP_START;
}

export function isWorkTime(s: VillagerSchedule): boolean {
  const t = ((s.timeOfDay % 24000) + 24000) % 24000;
  return t >= 2000 && t < 9000 && !s.isRaidActive;
}
