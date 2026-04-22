// Fire Aspect (sword). Sets hit target on fire. 4 seconds per level.

export const FIRE_ASPECT_MAX = 2;
export const FIRE_ASPECT_TICKS_PER_LEVEL = 80;

export function burnTicks(level: number): number {
  const eff = Math.max(0, Math.min(FIRE_ASPECT_MAX, level));
  return eff * FIRE_ASPECT_TICKS_PER_LEVEL;
}

// Fire Aspect also cooks food dropped by the target mob (chicken → cooked).
export function cooksDrop(dropId: string, hasFireAspect: boolean): string {
  if (!hasFireAspect) return dropId;
  if (dropId === 'chicken') return 'cooked_chicken';
  if (dropId === 'beef') return 'cooked_beef';
  if (dropId === 'porkchop') return 'cooked_porkchop';
  if (dropId === 'mutton') return 'cooked_mutton';
  if (dropId === 'rabbit') return 'cooked_rabbit';
  if (dropId === 'cod') return 'cooked_cod';
  if (dropId === 'salmon') return 'cooked_salmon';
  return dropId;
}

export function incompatibleWith(): string[] {
  return []; // plain sword enchant; no direct exclusions
}
