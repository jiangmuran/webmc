// Armadillo. Rolls into a ball when scared (hostile mob or undead
// within 8 blocks, or player sprinting). While curled, projectiles
// slide off, melee takes ~50% damage.

export interface Armadillo {
  rolled: boolean;
  rollStartedMs: number;
}

export const CURL_RADIUS = 8;
export const UNCURL_DELAY_MS = 3000;
export const DAMAGE_MULT_WHILE_CURLED = 0.5;

export function makeArmadillo(): Armadillo {
  return { rolled: false, rollStartedMs: -Infinity };
}

export interface ScareQuery {
  hostileNearby: boolean;
  playerSprintingNearby: boolean;
  nowMs: number;
}

export function updateCurl(a: Armadillo, q: ScareQuery): void {
  const scared = q.hostileNearby || q.playerSprintingNearby;
  if (scared && !a.rolled) {
    a.rolled = true;
    a.rollStartedMs = q.nowMs;
  } else if (!scared && a.rolled && q.nowMs - a.rollStartedMs >= UNCURL_DELAY_MS) {
    a.rolled = false;
  }
}

export function incomingDamage(
  a: Armadillo,
  raw: number,
  kind: 'projectile' | 'melee' | 'other',
): number {
  if (!a.rolled) return raw;
  if (kind === 'projectile') return 0;
  if (kind === 'melee') return raw * DAMAGE_MULT_WHILE_CURLED;
  return raw;
}

// Brushing a curled armadillo drops a scute (up to 1 per 5 min per animal).
export const SCUTE_COOLDOWN_MS = 5 * 60_000;

export function tryBrushScute(lastBrushMs: number, nowMs: number): boolean {
  return nowMs - lastBrushMs >= SCUTE_COOLDOWN_MS;
}
