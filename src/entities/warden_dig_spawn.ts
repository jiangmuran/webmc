export const DIG_EMERGE_TICKS = 225;
export const INVESTIGATION_TIMEOUT = 20 * 60;

export interface WardenPresence {
  ticksEmerged: number;
  ticksSinceAnyStimulus: number;
  currentTarget?: string;
}

export function shouldDig(p: WardenPresence): boolean {
  if (p.currentTarget !== undefined) return false;
  return p.ticksSinceAnyStimulus >= INVESTIGATION_TIMEOUT;
}

export function isEmerging(p: WardenPresence): boolean {
  return p.ticksEmerged < DIG_EMERGE_TICKS;
}

export const INITIAL_HEALTH = 500;
