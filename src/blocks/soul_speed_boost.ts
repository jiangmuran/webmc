// Soul Speed enchantment boost on soul sand/soul soil. Boots with
// level 1-3 gain speed multiplier 0.4 + 0.105 * level. Boots take
// ~4% chance per tick to lose durability.

export interface BootsState {
  soulSpeedLevel: number; // 0..3
  damage: number;
  maxDurability: number;
}

export function speedOnSoul(b: BootsState): number {
  if (b.soulSpeedLevel <= 0) return 1;
  return 1 + 0.4 + b.soulSpeedLevel * 0.105;
}

export interface TickQuery {
  onSoulBlock: boolean;
  rand: () => number;
}

export const DURABILITY_LOSS_CHANCE_PER_TICK = 0.04;

export function maybeWear(b: BootsState, q: TickQuery): number {
  if (b.soulSpeedLevel <= 0 || !q.onSoulBlock) return 0;
  if (q.rand() < DURABILITY_LOSS_CHANCE_PER_TICK) {
    b.damage = Math.min(b.maxDurability, b.damage + 1);
    return 1;
  }
  return 0;
}

export function isBroken(b: BootsState): boolean {
  return b.damage >= b.maxDurability;
}
