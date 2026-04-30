// Soul Speed boot enchant. While walking on soul sand or soul soil the
// player gets a speed boost. Boots take one durability per second spent
// on the accelerated surface.
//
// Wiki (minecraft.wiki/w/Soul_Speed): "the player's speed is adjusted
// by the multiplier (Soul Speed Level * 0.105) + 1.3."
//   L=1: 1.405, L=2: 1.51, L=3: 1.615
// Old `1 + 0.4 + 0.1 × level` rounded the per-level term to 0.1 (vs
// wiki 0.105) and added a 0.4 base (vs wiki 0.3) — at L=1 that gave
// 1.5 (~7% over wiki), at L=3 1.7 (~5% over). Sibling
// items/soul_speed.ts has the same fix.

export type SoulBlock = 'soul_sand' | 'soul_soil';

export interface SoulSpeedQuery {
  soulSpeedLevel: number; // 0 = no enchant
  onSoulBlock: boolean;
}

export function soulSpeedMultiplier(q: SoulSpeedQuery): number {
  if (!q.onSoulBlock || q.soulSpeedLevel <= 0) return 1;
  const l = Math.min(3, q.soulSpeedLevel);
  return l * 0.105 + 1.3;
}

// Boots take 1 durability per soul-second. Returns the integer damage
// that should be subtracted from the boots this tick (1 once per second).
export interface DurabilityTickState {
  secondsAccumulated: number;
}

export function makeDurabilityTick(): DurabilityTickState {
  return { secondsAccumulated: 0 };
}

export function tickSoulBootsDurability(
  state: DurabilityTickState,
  dtSec: number,
  q: SoulSpeedQuery,
): number {
  if (!q.onSoulBlock || q.soulSpeedLevel <= 0) return 0;
  state.secondsAccumulated += dtSec;
  const damage = Math.floor(state.secondsAccumulated);
  state.secondsAccumulated -= damage;
  return damage;
}
