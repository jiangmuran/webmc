export interface EffectCtx {
  activeEffectIds: Set<string>;
  drankMilkBucket: boolean;
}

export function removedEffects(c: EffectCtx): string[] {
  return c.drankMilkBucket ? [...c.activeEffectIds] : [];
}

export function returnsEmptyBucket(): boolean {
  return true;
}

export function curesMobInstantDamage(): boolean {
  return true;
}
