// Soul Speed boot enchant. While walking on soul sand or soul soil the
// player gets a speed boost of (40 + 10*level) % over baseline. Boots
// take one durability per second spent on the accelerated surface.

export type SoulBlock = 'soul_sand' | 'soul_soil';

export interface SoulSpeedQuery {
  soulSpeedLevel: number; // 0 = no enchant
  onSoulBlock: boolean;
}

export function soulSpeedMultiplier(q: SoulSpeedQuery): number {
  if (!q.onSoulBlock || q.soulSpeedLevel <= 0) return 1;
  const l = Math.min(3, q.soulSpeedLevel);
  return 1 + 0.4 + 0.1 * l;
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
