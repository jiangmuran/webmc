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

// Wiki (minecraft.wiki/w/Breeze): "Each Breeze takes about 30 ticks
// (1.5 s) to shoot one wind charge after locking on a target." Old
// 60-tick (3 s) cooldown was 2× the wiki value, halving the breeze's
// fire rate. Sibling breeze.ts uses 1.5 s.
export const BREEZE_SIGHT_RANGE = 24;
export const BREEZE_MELEE_FLEE_RANGE = 3;
export const BREEZE_ATTACK_COOLDOWN_TICKS = 30;

export function chooseAttack(c: BreezeCtx): BreezeAttackResult {
  if (!c.canSeeTarget || c.distanceToTarget > BREEZE_SIGHT_RANGE) return { kind: 'idle' };
  if (c.distanceToTarget < BREEZE_MELEE_FLEE_RANGE) return { kind: 'hop_away' };
  if (c.cooldownRemaining > 0) return { kind: 'idle' };
  return { kind: 'wind_charge', cooldownTicks: BREEZE_ATTACK_COOLDOWN_TICKS };
}

export function immuneTo(damageType: string): boolean {
  return damageType === 'wind_charge' || damageType === 'fall';
}
