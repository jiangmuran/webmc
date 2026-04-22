// Ender Dragon fireball: impacts leave a dragon's breath area-effect
// cloud that lingers and damages entities touching it.

export interface DragonCloud {
  radius: number;
  remainingTicks: number;
  damagePerTick: number;
}

export const DEFAULT_DRAGON_CLOUD_RADIUS = 3;
export const DEFAULT_DRAGON_CLOUD_DURATION = 600;
export const DRAGON_CLOUD_DAMAGE_PER_SECOND = 6;

export function spawnCloud(): DragonCloud {
  return {
    radius: DEFAULT_DRAGON_CLOUD_RADIUS,
    remainingTicks: DEFAULT_DRAGON_CLOUD_DURATION,
    damagePerTick: DRAGON_CLOUD_DAMAGE_PER_SECOND / 20,
  };
}

export function tick(c: DragonCloud): DragonCloud | null {
  if (c.remainingTicks <= 1) return null;
  return { ...c, remainingTicks: c.remainingTicks - 1 };
}

export function damageAt(c: DragonCloud, distance: number): number {
  if (distance > c.radius) return 0;
  return c.damagePerTick;
}

export function bottleable(): boolean {
  return true;
}
