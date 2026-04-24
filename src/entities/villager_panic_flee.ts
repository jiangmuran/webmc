export interface PanicInput {
  nearbyHostileCount: number;
  lastDamageTicksAgo: number;
  inDoor: boolean;
  nearestBedDistance?: number;
}

export const PANIC_COOLDOWN_TICKS = 100;
export const PANIC_RADIUS_HOSTILE = 8;

export function shouldPanic(i: PanicInput): boolean {
  if (i.nearbyHostileCount > 0) return true;
  return i.lastDamageTicksAgo < PANIC_COOLDOWN_TICKS;
}

export function fleeTarget(i: PanicInput): 'bed' | 'meeting_place' | 'indoor' | 'nowhere' {
  if (!shouldPanic(i)) return 'nowhere';
  if (i.inDoor) return 'indoor';
  if (i.nearestBedDistance !== undefined && i.nearestBedDistance < 20) return 'bed';
  return 'meeting_place';
}
