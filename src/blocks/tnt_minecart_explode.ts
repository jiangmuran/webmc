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

// Wiki (minecraft.wiki/w/Minecart_with_TNT): "The explosion has a
// base power of 4. The game also adds a random bonus value up to
// 1.5 times velocity, but no higher than 7.5."
//
// So total power = 4 + random(0, min(7.5, 1.5 × velocity)).
// Maximum total: 4 + 7.5 = 11.5 (at velocity ≥ 5).
//
// Old `min(8, 4 + floor(speed * 4))` was wrong on two counts:
//   1. Capped at 8 (wiki cap is 11.5)
//   2. Linear `speed * 4` ramp instead of random(0, 1.5×speed)
// At speed 1 the old function gave 8, while wiki says random(4, 5.5).
export const EXPLOSION_POWER_BASE = 4;
export const EXPLOSION_POWER_BONUS_MAX = 7.5;

export function explosionPower(crashedAtSpeed: number, rand: () => number = Math.random): number {
  const bonusCap = Math.min(EXPLOSION_POWER_BONUS_MAX, 1.5 * crashedAtSpeed);
  const bonus = bonusCap > 0 ? rand() * bonusCap : 0;
  return EXPLOSION_POWER_BASE + bonus;
}
