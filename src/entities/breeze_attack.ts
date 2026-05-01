// Breeze: hostile mob in trial chambers. Shoots wind charges, evades
// by hopping. Immune to wind charges and fall damage.

export type BreezeAttackResult =
  | { kind: 'wind_charge'; cooldownTicks: number }
  | { kind: 'hop_away' }
  | { kind: 'idle' };

export interface BreezeCtx {
  distanceToTarget: number;
  canSeeTarget: boolean;
  cooldownRemaining: number;
}

// Wiki (minecraft.wiki/w/Breeze#Wind_charge): "Breezes attempt to
// shoot a wind charge at a player or enemy within a distance of 16
// blocks, with a cooldown of 32 game ticks (1.6 seconds) between
// attempts."
//
// Old constants: SIGHT_RANGE=24 (50% over wiki), COOLDOWN=30 ticks
// (off by 2). Both miscalibrated breeze combat — the longer sight
// range made breezes engage from too far, and the shorter cooldown
// gave them ~7% more wind-charge volume than canon.
export const BREEZE_SIGHT_RANGE = 16;
export const BREEZE_MELEE_FLEE_RANGE = 3;
export const BREEZE_ATTACK_COOLDOWN_TICKS = 32;

export function chooseAttack(c: BreezeCtx): BreezeAttackResult {
  if (!c.canSeeTarget || c.distanceToTarget > BREEZE_SIGHT_RANGE) return { kind: 'idle' };
  if (c.distanceToTarget < BREEZE_MELEE_FLEE_RANGE) return { kind: 'hop_away' };
  if (c.cooldownRemaining > 0) return { kind: 'idle' };
  return { kind: 'wind_charge', cooldownTicks: BREEZE_ATTACK_COOLDOWN_TICKS };
}

export function immuneTo(damageType: string): boolean {
  return damageType === 'wind_charge' || damageType === 'fall';
}
