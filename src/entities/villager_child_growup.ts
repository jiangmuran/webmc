export const GROWUP_TICKS = 24000;

export interface VillagerChild {
  ageTicks: number;
}

export function isAdult(c: VillagerChild): boolean {
  return c.ageTicks >= GROWUP_TICKS;
}

export function canChooseProfession(c: VillagerChild): boolean {
  return isAdult(c);
}

export function runsFromPlayer(c: VillagerChild): boolean {
  return !isAdult(c);
}
