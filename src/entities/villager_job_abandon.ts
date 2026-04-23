export const TRADE_LOCKOUT_TICKS = 20 * 60 * 10;

export interface Employment {
  profession: string;
  hasTradedAtLeastOnce: boolean;
  workstationDestroyedAtTick?: number;
}

export function shouldAbandon(
  e: Employment,
  workstationExists: boolean,
  currentTick: number,
): boolean {
  if (!workstationExists && e.workstationDestroyedAtTick !== undefined) {
    return currentTick - e.workstationDestroyedAtTick >= TRADE_LOCKOUT_TICKS;
  }
  return false;
}

export function retainsLevelIfTraded(e: Employment): boolean {
  return e.hasTradedAtLeastOnce;
}
