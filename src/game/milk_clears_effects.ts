export interface EffectEntry {
  id: string;
  durationTicks: number;
  amplifier: number;
}

export interface PlayerEffects {
  active: EffectEntry[];
}

export function drinkMilk(p: PlayerEffects): PlayerEffects {
  return { active: [] };
}

export function countCleared(before: PlayerEffects): number {
  return before.active.length;
}

export function cooldownTicks(): number {
  return 0;
}
