// TNT minecart. Explodes when: powered rail activates it, it crashes
// at high speed, destroyed, or ignited by flint/fire.

export interface TntMinecart {
  fuseTicks: number; // -1 = inactive
  powered: boolean;
  velocity: number; // blocks/tick
}

export const INACTIVE = -1;
export const SHORT_FUSE = 20;
export const NORMAL_FUSE = 80;

export function makeTntMinecart(): TntMinecart {
  return { fuseTicks: INACTIVE, powered: false, velocity: 0 };
}

export function ignite(c: TntMinecart, ticks = NORMAL_FUSE): void {
  c.fuseTicks = ticks;
}

export interface ActivateQuery {
  poweredRailBelow: boolean;
  crashedAtSpeed: number;
  hitByArrowOnFire: boolean;
}

export function onActivate(c: TntMinecart, q: ActivateQuery): boolean {
  if (q.poweredRailBelow) {
    if (c.fuseTicks === INACTIVE) c.fuseTicks = NORMAL_FUSE;
    return true;
  }
  if (q.crashedAtSpeed > 0.4) {
    ignite(c, SHORT_FUSE);
    return true;
  }
  if (q.hitByArrowOnFire) {
    ignite(c, NORMAL_FUSE);
    return true;
  }
  return false;
}

export function tickTnt(c: TntMinecart): 'exploded' | 'ticking' | 'idle' {
  if (c.fuseTicks === INACTIVE) return 'idle';
  c.fuseTicks -= 1;
  if (c.fuseTicks <= 0) return 'exploded';
  return 'ticking';
}

export const EXPLOSION_POWER_BASE = 4;

export function explosionPower(crashedAtSpeed: number): number {
  // Faster crashes yield bigger explosions.
  return Math.min(8, EXPLOSION_POWER_BASE + Math.floor(crashedAtSpeed * 4));
}
