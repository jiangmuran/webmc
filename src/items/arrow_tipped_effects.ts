export interface TippedArrowSpec {
  effects: { id: string; durationTicks: number; amplifier: number }[];
}

export const POTION_DURATION_MULT = 0.125;

export function arrowEffectDuration(potionDurationTicks: number): number {
  return Math.max(1, Math.floor(potionDurationTicks * POTION_DURATION_MULT));
}

export function combinedSpec(base: TippedArrowSpec, extra: TippedArrowSpec): TippedArrowSpec {
  return { effects: [...base.effects, ...extra.effects] };
}

export function isInstant(effect: { id: string }): boolean {
  return effect.id === 'instant_health' || effect.id === 'instant_damage';
}
