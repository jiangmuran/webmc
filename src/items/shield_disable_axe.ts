// Axe vs Shield. Hitting a shield with an axe disables the shield for
// 5 seconds. Crit axe hits extend disable to 6.4 seconds.

export interface ShieldDisable {
  disabledUntilMs: number;
}

export const DISABLE_BASE_MS = 5000;
export const DISABLE_CRIT_MS = 6400;

export interface AxeHitQuery {
  isAxe: boolean;
  isCrit: boolean;
  nowMs: number;
}

export function onAxeHitShield(s: ShieldDisable, q: AxeHitQuery): boolean {
  if (!q.isAxe) return false;
  const dur = q.isCrit ? DISABLE_CRIT_MS : DISABLE_BASE_MS;
  s.disabledUntilMs = q.nowMs + dur;
  return true;
}

export function shieldDisabled(s: ShieldDisable, nowMs: number): boolean {
  return nowMs < s.disabledUntilMs;
}

// Secondary: if axe is enchanted with Impaling / Smite-like, different
// multiplier, not modeled here.
export function axeEfficiencyBonus(
  axeTier: 'wood' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite',
): number {
  const table = {
    wood: 0,
    stone: 1,
    iron: 2,
    gold: 0,
    diamond: 3,
    netherite: 4,
  };
  return table[axeTier];
}
