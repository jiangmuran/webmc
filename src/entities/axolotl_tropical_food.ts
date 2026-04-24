export type AxolotlAction = 'tropical_fish_bucket' | 'water_breathe_regen' | 'idle';

const VALID_FOODS = new Set<string>(['tropical_fish_bucket']);

export function canFeed(itemId: string): boolean {
  return VALID_FOODS.has(itemId);
}

export const REGEN_DURATION_ON_PLAYER_REVIVE = 20 * 100;
export const EFFECT_AMPLIFIER = 0;

export function grantsRegenOnAttack(): { id: string; duration: number; amplifier: number }[] {
  return [
    { id: 'regeneration', duration: REGEN_DURATION_ON_PLAYER_REVIVE, amplifier: EFFECT_AMPLIFIER },
    {
      id: 'mining_fatigue',
      duration: REGEN_DURATION_ON_PLAYER_REVIVE,
      amplifier: EFFECT_AMPLIFIER,
    },
  ];
}

export function playDeadDuration(rng: () => number): number {
  return 200 + Math.floor(rng() * 100);
}
