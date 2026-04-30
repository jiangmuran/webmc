// Axe vs Shield disable.
//
// Wiki (minecraft.wiki/w/Shield#Disabling): "All of a user's shields
// are disabled for 5 seconds if hit by an axe-wielding player while
// the user's shield is up." A flat 5 seconds (100 ticks) regardless
// of whether the hit was critical. Old code had DISABLE_CRIT_MS=6400
// (1.4s extra on crits) — not in the wiki for modern versions.

export interface ShieldDisable {
  disabledUntilMs: number;
}

export const DISABLE_BASE_MS = 5000;
// Kept for API back-compat — wiki has no separate crit value, so
// crits use the same 5-second window.
export const DISABLE_CRIT_MS = DISABLE_BASE_MS;

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
